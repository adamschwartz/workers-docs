import React from "react"
import { graphql, Link } from "gatsby"

import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import a from "./mdx/anchor-link"
import headers from "./mdx/headers"
import inlineCode from "./mdx/inline-code"
import pre from "./mdx/code-block"
import Aside from "./mdx/aside"
import Example from "./mdx/example"
import Definitions from "./mdx/definitions"
import Code from "./mdx/code"
import ParamType from "./mdx/param-type"
import Type from "./mdx/type"
import TypeLink from "./mdx/type-link"
import PropMeta from "./mdx/prop-meta"
import DirectoryListing from "./mdx/directory-listing"
import YouTube from "./mdx/youtube"

// https://mdxjs.com/table-of-components
// https://www.gatsbyjs.org/docs/mdx/customizing-components/
const components = {
  // Replace native DOM elements
  a,
  ...headers,
  inlineCode,
  pre,

  // Add custom components
  Link,
  Aside,
  Example,
  Definitions,
  Code,
  ParamType,
  Type,
  TypeLink,
  PropMeta,
  DirectoryListing,
  YouTube,
}

const MDXCustomRenderer = ({ data: { mdx } }) => {
  return (
    <MDXProvider components={components}>
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </MDXProvider>
  )
}

export default MDXCustomRenderer

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`
