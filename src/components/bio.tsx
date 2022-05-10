/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { BioQueryQuery } from "../../graphql-types"
import { useCurrentLang } from "../hooks/useCurrentLang"

const Bio: React.FC = () => {
  const data = useStaticQuery<BioQueryQuery>(graphql`
    query BioQuery {
      site {
        siteMetadata {
          i18n {
            lang
            siteMetadata {
              author {
                name
                summary
              }
            }
          }
        }
      }
    }
  `)

  const currentLang = useCurrentLang()

  let langSwitcher = null

  switch (currentLang) {
    case "EN":
      langSwitcher = <a href={`../ru/`}>Читать на русском</a>
      break
    case "RU":
      langSwitcher = <a href={`../en/`}>Читать на английском</a>
      break
    default:
      langSwitcher = null
  }

  const i18nSiteMetadata = data.site?.siteMetadata?.i18n?.find(
    ({ lang }) => lang === currentLang
  )?.siteMetadata

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = i18nSiteMetadata?.author

  let authorContent = null
  let alt = null

  switch (currentLang) {
    case "EN":
      authorContent = (
        <>
          Author: <strong>{author.name}</strong>
        </>
      )
      alt = "Profile picture"
      break
    case "RU":
      authorContent = (
        <>
          Автор: <strong>{author.name}</strong>
        </>
      )
      alt = "Фото профиля"
      break
    default:
      authorContent = null
      alt = null
  }

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-pic.jpg"
        width={50}
        height={50}
        quality={95}
        alt={alt}
      />
      {author?.name && (
        <div>
          <p>{authorContent}</p>
          {langSwitcher && <p>{langSwitcher}</p>}
        </div>
      )}
    </div>
  )
}

export default Bio
