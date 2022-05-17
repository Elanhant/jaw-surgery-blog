const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              lang
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  function getDateFormatForLang(lang) {
    switch (lang) {
      case "EN":
        return "MMMM DD, YYYY"
      case "RU":
        return "D MMMM YYYY"
      default:
        return "MMMM DD, YYYY"
    }
  }

  const languages = new Set()
  const postsByLanguage = new Map()

  for (const post of posts) {
    const lang = post.frontmatter.lang

    languages.add(lang)
    if (!postsByLanguage.has(lang)) {
      postsByLanguage.set(lang, [])
    }
    postsByLanguage.get(lang).push(post)
    // postsByLanguage.set(lang, (postsByLanguage.get(lang) ?? []).concat([post]))
  }

  for (const [lang, postsInLanguage] of postsByLanguage) {
    postsInLanguage.forEach((post, index) => {
      const previousPostId = index === 0 ? null : postsInLanguage[index - 1].id
      const nextPostId =
        index === postsInLanguage.length - 1
          ? null
          : postsInLanguage[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
          lang,
          locale: lang.toString(),
          dateFormat: getDateFormatForLang(lang),
        },
      })
    })
  }

  const blogHome = path.resolve(`./src/templates/blog-home.tsx`)

  for (const lang of languages) {
    const langLowerCase = lang.toLowerCase()

    createPage({
      path: `/${langLowerCase}`,
      component: blogHome,
      context: {
        lang,
        locale: lang.toString(),
        dateFormat: getDateFormatForLang(lang),
      },
    })

    createRedirect({
      fromPath: `/`,
      toPath: `/${langLowerCase}`,
      conditions: {
        language: [langLowerCase],
      },
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      i18n: [SiteI18nMetadataForLang]
    }

    type SiteI18nMetadataForLang {
      lang: Language
      sitei18nMetadata: SiteI18nMetadata
    }

    type SiteI18nMetadata {
      author: Author
      title: String
      description: String
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    enum Language {
      EN
      RU
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      lang: Language
    }

    type Fields {
      slug: String
    }
  `)
}
