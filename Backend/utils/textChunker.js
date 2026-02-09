

// turns a long PDF into smart pieces 

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) return [];

    // Clean text while preserving paragraph structure
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\r /g, '\n')
        .replace(/ \n/g, '\n')
        .trim();

    // Split by paragraphs (single or double newlines)
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // If paragraph is bigger than chunkSize, split by words
        if (paragraphWordCount > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            // Split large paragraph into word-based chunks
            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                if (i + chunkSize >= paragraphWords.length) break;
            }
            continue;
        }

        // If adding this paragraph exceeds chunk size, save current chunk
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
            
            // Create overlap from previous chunk
            const prevChunkText = currentChunk.join('');
            const prevWords = prevChunkText.split(/\s+/);
            const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');
            
            // Start new chunk with overlap
            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
        } else {
            // Add paragraph to current chunk
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;
        }

        // If current chunk exceeds chunkSize, save it
        if (currentWordCount >= chunkSize) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
            currentChunk = [];
            currentWordCount = 0;
        }
    }

    // Add any remaining chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    }

    // Fallback: if no chunks created, sanitize and split by words
    if (chunks.length === 0 && cleanedText.length > 0) {
        const allWords = cleanedText.split(/\s+/);
        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
            const chunkWords = allWords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
            if (i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};

// searches inside chunks 
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
    if (!chunks || chunks.length === 0 || !query) return [];
    
    // Define stopwords to filter out common words
    const stopwords = new Set([
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
        'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it'
    ]);
    
    // Extract and clean query words
    const queryWords = query.toLowerCase()
        .split(/\s+/)
        .filter(w => !stopwords.has(w));
    
    if (queryWords.length === 0) {
        // Return clean chunk objects without Mongoose metadata
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id
        }));
    }
    
    const scoredChunks = chunks.map((chunk, index) => {
        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;
        let score = 0;
        const matchedWords = new Set();

        const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Score each query word
        for (const word of queryWords) {
           const escapedWord = escapeRegex(word);
            // Exact word match (higher score)
           const exactMatches = (content.match(new RegExp(`\\b${escapedWord}\\b`, 'gi')) || []).length;
            score += exactMatches * 3;

            // Partial match (lower score)
            const partialMatches = (content.match(new RegExp(escapedWord, 'g')) || []).length;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
            
            // Track which words were matched
            if (exactMatches > 0 || partialMatches > 0) {
                matchedWords.add(word);
            }
        }

        // Bonus: Multiple query words found
        const uniqueWordsFound = matchedWords.size;
        if (uniqueWordsFound > 1) {
            score += uniqueWordsFound * 2;
        }

        // Normalize by content length
        const normalizedScore = score / Math.sqrt(contentWords);

        // Small bonus for earlier chunks
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        // Return clean object without Mongoose metadata
        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: uniqueWordsFound
        };
    });


    const topChunks = scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);

    return topChunks.map(chunk => ({
    content: chunk.content,
    chunkIndex: chunk.chunkIndex,
    pageNumber: chunk.pageNumber,
    _id: chunk._id
    }));

};