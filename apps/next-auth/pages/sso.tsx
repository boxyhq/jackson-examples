import { useEffect } from "react"
import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"

export default function Page() {
  return (
    <Layout>
      <h1>Login with SAML SSO</h1>
      <div className="page">
        <div className="signin">
          <div className="card">
            <div className="provider">
              <form
                action="http://localhost:3366/api/auth/signin/boxyhq-saml"
                method="POST"
              >
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "space-between",
                    height: "10vh",
                  }}
                >
                  <label htmlFor="email">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jackson@example.com"
                    value="jackson@example.com"
                    required
                    style={{
                      display: "block",
                      borderRadius: "0.25rem",
                      borderWidth: "1px",
                      borderColor: "#D1D5DB",
                      width: "100%",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem",
                      appearance: "none",
                    }}
                  />
                  <button type="submit" className="button">
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
