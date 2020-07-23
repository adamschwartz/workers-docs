import React from "react"
import { Link } from "gatsby"

import { className } from "./root"
import IconExternalLink from "../icons/external-link"
const linkClassName = className("link")
const contentClassName = `${ linkClassName }-content`
const externalIconClassName = `${linkClassName}-external-icon`

export default ({ href, className, children, ...props }) => {
  if (!href || !children) return (<a {...props}/>)

  const isImageLink = typeof children === "object" &&
    children.props &&
    children.props.className === "gatsby-resp-image-wrapper"

  const isExternal = !!href.match(/^https?:/)
  const isHash = href.indexOf("#") === 0

  const useRegularLink = isImageLink || isExternal || isHash

  return useRegularLink ? (
    (isExternal && !isImageLink) ? (
      <a href={href} className={className || linkClassName} {...props}>
        <span className={contentClassName}>{children}</span>
        <IconExternalLink className={externalIconClassName}/>
      </a>
    ) : (
      <a href={href} className={className || linkClassName} {...props}>
        <span className={contentClassName}>{children}</span>
      </a>
    )
  ) : (
    <Link to={href} className={className || linkClassName} {...props}>
      <span className={contentClassName}>{children}</span>
    </Link>
  )
}
