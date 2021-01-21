import {useState} from "react";
import {useRouter} from "next/router";
import LineLoad from "../Loader/lineLoad";
import axios from "axios";



export const SignInModal = () => {
    const [variables, setVariables] = useState({
        userOrEmail: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const { reload } = useRouter()


    const submitForm = async e => {
        e.preventDefault()
        if (variables.userOrEmail !== '' && variables.password !== '') {

            try {
                const resp = await axios.post('/api/auth/login', variables)


                const { success } = resp.data

                if (success) {
                    localStorage.setItem('token', resp.data.message)
                    reload()
                } else {
                    setErrors(resp.data.errors)
                }

            } catch (e) {
                console.log(e.message)
            }

        }

    }

    return (
        <>
            <div className={"form__container relative"}>
                <form onSubmit={submitForm} className={' flex flex-col --form'}>
                    <h1 className={'uppercase'}>sign in</h1>
                    <div className={'flex flex-col my-3 '}>
                        <label
                            htmlFor="userOrEmail"
                            className={`mb-2 ${errors.userOrEmail && 'text-red-500'}`}
                        >
                            {
                                errors.userOrEmail ?? 'Username or Email'
                            }
                        </label>
                        <input
                            name={'userOrEmail'}
                            className={` shadow-sm px-4 py-2 rounded-2xl bg-gray-50  dark:bg-gray-700 ring-4 ${errors.userOrEmail ? 'ring-red-500' : variables.userOrEmail ? 'ring-green-300' :  'ring-gray-100'} focus:ring-blue-300`}
                            autoComplete={'off'}
                            onChange={({target}) => setVariables({...variables, userOrEmail: target.value})}
                            value={variables.userOrEmail}
                        />
                    </div>
                    <div className={'flex flex-col my-3 '}>
                        <label
                            htmlFor="password"
                            className={`mb-2 ${errors.password && 'text-red-500'}`}
                        >
                            {
                                errors.password ?? 'Password'
                            }
                        </label>
                        <input
                            type={'password'}
                            name={'password'}
                            autoComplete={'off'}
                            className={` shadow-sm px-4 py-2 rounded-2xl bg-gray-50  dark:bg-gray-700 ring-4 ${errors.password ? 'ring-red-500' : variables.password ? 'ring-green-300' :  'ring-gray-100'} focus:ring-blue-300`}
                            onChange={({target}) => setVariables({...variables, password: target.value})}
                            value={variables.password}
                        />
                    </div>
                    <button
                        type={"submit"}
                        className={'shadow-sm p-4 mt-14  w-full text-xl text-white uppercase mx-auto ring-4 ring-red-700 bg-red-500 rounded '}
                        disabled={!variables.userOrEmail || !variables.password}
                    >
                        {loading ? 'รอสักครู่...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
                {
                    loading &&
                    <LineLoad />
                }
            </div>
            <style jsx>{`
              .form__container:before {
                ${loading && `
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-color: rgba(255,255,255,.6);
                    z-index: 1;
                    pointer-events: none;
                `}
              }

              .--form {
                min-height: 300px;
                padding: 2rem;
              }

              .--form h1 {
                font-size: 3rem;
                color: #444;
                font-weight: bold;
                text-shadow: 2px 2px 2px rgba(0, 0, 0, .4);
                cursor: default;
                margin-bottom: 1.5rem;
                
              }
            `}</style>
        </>
    )
}
