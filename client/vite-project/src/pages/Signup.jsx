import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AtSign, KeyRound, Mail, UserRound } from 'lucide-react'
import { axiosInstance } from '../axiosCalls/axios'
import { AuthShell, PillButton } from '../components/AuthShell'
import Field from '../components/ui/Field'

function Signup() {
    const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
    const [loader, setLoader] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        if (errorMsg) setErrorMsg('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation checks
        if (!form.name || !form.username || !form.email || !form.password) {
            setErrorMsg('Please fill in all fields.')
            return
        }

        setLoader(true)
        setErrorMsg('')

        try {
            await axiosInstance.post('/users/register', form)
            console.log("User Registered")
            navigate('/login')
        } catch (error) {
            console.log(error)
            setErrorMsg(
                error.response?.data?.message || 'Registration failed. Please try again.'
            )
        } finally {
            setLoader(false)
        }
    }

    return (
        <AuthShell
            heading={<>Start your <span className="font-normal text-maroon">circle</span>.</>}
            subheading="Create an account in less than a minute."
            errorMsg={errorMsg}
            footer={
                <>
                    Already part of the community?{' '}
                    <Link to="/login" className="font-bold text-ochre-deep underline-offset-4 hover:underline">
                        Log in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Field
                    id="name"
                    label="Full name"
                    icon={UserRound}
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    disabled={loader}
                />
                <Field
                    id="username"
                    label="Username"
                    icon={AtSign}
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="alexmorgan"
                    disabled={loader}
                />
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
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={loader}
                />
                <div className="pt-2">
                    <PillButton loading={loader} loadingText="Creating account...">
                        Create account
                    </PillButton>
                </div>
            </form>
        </AuthShell>
    )
}

export default Signup
