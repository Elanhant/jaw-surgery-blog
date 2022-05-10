/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { useCurrentLang } from "../hooks/useCurrentLang"
import { SeoQueryQuery } from "../../graphql-types"

const Seo = ({ description, meta, title }) => {
  const { site } = useStaticQuery<SeoQueryQuery>(
    graphql`
      query SeoQuery {
        site {
          siteMetadata {
            i18n {
              lang
              siteMetadata {
                title
                description
                author {
                  name
                  summary
                }
              }
            }
          }
        }
      }
    `
  )

  const currentLang = useCurrentLang()
  const i18nSiteMetadata = site?.siteMetadata?.i18n?.find(
    ({ lang }) => lang === currentLang
  )?.siteMetadata

  const metaDescription = description ?? i18nSiteMetadata.description
  const defaultTitle = i18nSiteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{
        lang: currentLang.toLowerCase(),
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
      ].concat(meta)}
    />
  )
}

Seo.defaultProps = {
  meta: [],
  description: ``,
}

Seo.propTypes = {
  description: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default Seo
