import * as React from "react"
import { Link } from "gatsby"
import { useCurrentLang } from "../hooks/useCurrentLang"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const currentLang = useCurrentLang()
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to={`/${currentLang.toLowerCase()}`}>{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to={`/${currentLang.toLowerCase()}`}>
        {title}
      </Link>
    )
  }

  let copyright = null

  switch (currentLang) {
    case "EN":
      copyright = (
        <>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </>
      )
      break
    case "RU":
      copyright = (
        <>
          © {new Date().getFullYear()}, на основе
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </>
      )
      break
    default:
      copyright = null
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>{copyright}</footer>
    </div>
  )
}

export default Layout
