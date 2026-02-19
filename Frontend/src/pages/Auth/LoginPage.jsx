import React , {useState} from 'react'
import {Link , useNavigate} from 'react-router-dom'
import useUser from '../../context/AuthContext'
import {BrainCircuit , Mail , Lock , ArrowRight} from 'lucide-react'
import toast from 'react-hot-toast'
import authServices from '../../Services/authService'



function LoginPage() {
  const [formData , setFormData] = useState({
    email : "",
    password : ""
  })
  const [isLoading , setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const { loginContext } = useUser()
  const navigate = useNavigate()

 const onChangeHandler = (e)=>{
    setFormData((prev)=>({ ...prev , [e.target.name] : e.target.value}))
  }

  const onSubmitHandler = async ()=>{
    try{
      setIsLoading(true)
       const {token , userData} = await authServices.loginUser(formData.email , formData.password)
       loginContext(token , userData)
       toast.success("Logged in Successfully")
       navigate("/dasboard")

    }catch(error){  
      console.log("error in submit login" , error.message)
      toast.error(error.message || "Login Failed")

    }finally{
      setIsLoading(false)
    }
  }

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px , transparent_1pxl)] bg-size[16px_16px] opacity-30">
                <div className="relative w-full max-w-md px-6">
                 
                    <div className="bg-white/80 backdrop-blur-xl border border-slate200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-10">
                       {/* Header */}
                       <div className="text-center mb-10" >
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-6">
                            <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2}/>
                        </div>
                        <h1 className="text-2xl font-medium text-slate-900 tracking-light mb-2">Welcome back</h1>
                        <p className="text-slate-500 text-sm">Sign in to continue your journey</p>
                       </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <div className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                <label className="">Email</label>
                                <div className="relative-group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'email' ? text-emerald-500 : text-slate-400}`}>
                                        <Mail className="h-5 w-5" strokeWidth={2} />
                                    </div>
                                    <input 
                                        type="email"  
                                        name="email"
                                        className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate50/50 text-slate-900 place-holder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10 "
                                        onChange={onChangeHandler}
                                        onFocus={setFocusedField('email')}
                                        onBlur={setFocusedField(null)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2 ">
                            <label className="block text-xs font-semibold ">Password</label>
                            <div className="">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'password' ? text-emerald-500 : text-slate-400}`}>
                                    <Lock className="strokeWidth(2)" />
                                </div>
                                <input 
                                    type="password" 
                                    name = "password"
                                    onFocus={setFocusedField('password')}
                                    onBlur={setFocusedField(null)}
                                    onChange={onChangeHandler}
                                    className=""
                                    placeholder="......"
                                />
                            </div>
                        </div>
                    </div>
                </div>


                             <button onClick={onSubmitHandler} disabled={isLoading} className="btn btn-primary w-full">
                        <span>
                            {
                              isLoading ? 
                              (
                                <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                loading...
                                </>
                              ) :
                              (
                                  <>  
                                    Sign in 
                                    <ArrowRight className='' strokeWidth={2.5}/>
                                  </>
                              )
                            }

                        </span>
                        <div className=''/>
                       </button>   

           // {footer}

           <div className=''>
              <p className=''>
                Don't have an account ? {' '} 
                <Link to="/signup" className=''>
                  Sign up
                </Link>
              </p>
           </div>


           <p className=''>
                By continuing , you agree to our Terms & Privacy Policy
           </p>
            </div>
        </div>


        
    );
};

export default LoginPage
