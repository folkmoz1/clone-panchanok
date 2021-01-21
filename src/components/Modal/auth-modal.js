import {useState} from "react";
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import LineLoad from "../Loader/lineLoad";


const LOGIN_USER = gql`
    query LOGIN_USER($userOrEmail: String!, $password: String!) {
        login(userOrEmail: $userOrEmail, password: $password) {
            success
            message
        }
    }
`

export const SignInModal = () => {
    const [variables, setVariables] = useState({
        userOrEmail: '',
        password: ''
    })
    const [errors, setErrors] = useState({})


    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors) ,
        onCompleted: (data) => {
            localStorage.setItem('token', data.login.message)
            window.location.href = '/'

        }
    })

    const submitForm = async e => {
        e.preventDefault()

        loginUser({variables})
    }

    return (
        <>
            <div className={"form__container relative"}>
                <form onSubmit={submitForm} className={' flex flex-col --form'}>
                    <h1 className={'uppercase'}>sign in</h1>
                    <div className={'flex flex-col my-3 '}>
                        <label
                            htmlFor="userOrEmail"
                            className={`mb-2 ${errors.username && 'text-red-500'}`}
                        >
                            {
                                errors.username ?? 'Username or Email'
                            }
                        </label>
                        <input
                            name={'userOrEmail'}
                            className={` shadow-sm px-4 py-2 rounded-2xl bg-gray-50  dark:bg-gray-700 ring-4 ${errors.username ? 'ring-red-500' : variables.userOrEmail ? 'ring-green-300' :  'ring-gray-100'} focus:ring-blue-300`}
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
                            className={` shadow-sm px-4 py-2 rounded-2xl bg-gray-50  dark:bg-gray-700 ring-4 ${errors.password ? 'ring-red-500' : variables.userOrEmail ? 'ring-green-300' :  'ring-gray-100'} focus:ring-blue-300`}
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
