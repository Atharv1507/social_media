import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, Mail } from 'lucide-react'
import { axiosInstance } from '../axiosCalls/axios'
import { useAuth } from '../context/AuthContext'
import { AuthShell, PillButton } from '../components/AuthShell'
import Field from '../components/ui/Field'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loader, setLoader] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const { setUser } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        if (errorMsg) setErrorMsg('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation checks
        if (!form.email || !form.password) {
            setErrorMsg('Please fill in both email and password.')
            return
        }

        setLoader(true)
        setErrorMsg('')

        try {
            const user = await axiosInstance.post('/users/login', form)
            console.log(user)
            console.log("User Logged in")

            setUser(user.data.userData)
            navigate('/home')
        } catch (error) {
            console.log(error)
            setErrorMsg(
                error.response?.data?.message || 'Login failed. Please check your credentials.'
            )
        } finally {
            setLoader(false)
        }
    }

    return (
        <AuthShell
            heading={<>Welcome <span className="font-normal text-maroon">back</span>.</>}
            subheading="Log in to catch up with your circle."
            errorMsg={errorMsg}
            footer={
                <>
                    New here?{' '}
                    <Link to="/signup" className="font-bold text-ochre-deep underline-offset-4 hover:underline">
                        Create an account
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Field
                    id="email"
                    label="Email"
                    icon={Mail}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    disabled={loader}
                />
                <Field
                    id="password"
                    label="Password"
                    icon={KeyRound}
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    disabled={loader}
                />
                <div className="pt-2">
                    <PillButton loading={loader} loadingText="Logging in...">
                        Log in
                    </PillButton>
                </div>
            </form>
        </AuthShell>
    )
}

export default Login
