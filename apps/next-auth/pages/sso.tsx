import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"

import Layout from "../components/layout"
import coreStyles from "../components/header.module.css"

const styles = {
  container: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "space-between",
    width: "300px",
    gap: "10px",
  },
  input: {
    display: "block",
    borderWidth: "1px",
    borderColor: "#D1D5DB",
    fontSize: "0.875rem",
    appearance: "none",
    height: "2rem",
  },
} as const

export default function Page() {
  const [email, setEmail] = useState("jackson@example.com")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      return
    }

    const tenant = email.split("@")[1]

    await signIn("boxyhq-saml", undefined, {
      tenant,
      product: "jackson",
    })
  }

  return (
    <Layout>
      <h1>Login with SAML SSO</h1>
      <div className="page">
        <div className="signin">
          <div className="card">
            <div className="provider">
              <form method="POST" onSubmit={onSubmit}>
                <div style={styles.container}>
                  <label htmlFor="email">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jackson@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    className={coreStyles.input}
                  />
                  <button type="submit" className={coreStyles.buttonPrimary}>
                    <span>Sign in with BoxyHQ SAML</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
