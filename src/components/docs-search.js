import React, { useEffect } from "react"
import { navigate } from "@reach/router"
import getPathPrefix from "../utils/get-path-prefix"

import Helmet from "react-helmet"

import DocsTitle from "./docs-title"
import AccessibleSVG from "./accessible-svg"

const DocsSearch = () => {
  useEffect(() => {
    let frames = 0
    const init = () => {
      frames += 1

      // Sadly this is needed because of the way Helmet works in local development
      if (!window.docsearch && frames < 60) {
        return requestAnimationFrame(() => init())
      }

      const search = window.docsearch({
        indexName: "cloudflare-workers-v2",
        apiKey: "9c24e56570a37c30bba608dad543d1d8",

        // TODO: pass DOM in with Reacth.createRef?
        inputSelector: "#DocsSearch--input",

        autocompleteOptions: {
          // https://github.com/algolia/autocomplete.js#global-options
          autoselect: true,
          openOnFocus: true,
          clearOnSelected: false,
          tabAutocomplete: false,

          appendTo: ".DocsSearch--input-wrapper",
          hint: false,

          autoselectOnBlur: matchMedia("(pointer: course)").matches
        },

        // https://docsearch.algolia.com/docs/behavior
        handleSelected: (input, event, suggestion, datasetNumber, context) => {
          const url = new URL(suggestion.url)

          // TODO: remove after Algolia crawls the pathPrefixed site
          const pathPrefix = getPathPrefix()
          const pathname =
            url.pathname.startsWith(`${pathPrefix}/`) ?
              url.pathname :
              pathPrefix + url.pathname

          if (suggestion.isLvl0) {
            // Don’t scroll to hash when it’s just the h1.
            navigate(pathname)

          } else {
            // When search results also scroll to hash,
            // blur the input so it’s not confusing that
            // your focus is still up in the search, and
            // also clear the input for next use.
            search.input[0].blur()
            search.input[0].value = ""
            navigate(pathname + url.hash)

            // Then focus the anchor in the header anchor
            // corresponding to the hash if it exists (it
            // should if Algolia’s crawl is up-to-date).
            const headerAnchor = document.querySelector(`${url.hash} a`)
            if (headerAnchor) headerAnchor.focus()
          }
        },

        transformData: function(hits) {
          // Remove empty results
          for (let i = hits.length - 1; i >= 0; i -= 1) {
            if (!hits[i].hierarchy.lvl0 && !hits[i].hierarchy.lvl1) {
              hits.splice(i, 1)
            }
          }
        }
      })

      const autocompleteWrapper = search.autocomplete.autocomplete.getWrapper()

      search.autocomplete.on("autocomplete:shown", event => {
        autocompleteWrapper.setAttribute("data-expanded", true)
      })

      search.autocomplete.on("autocomplete:closed", event => {
        autocompleteWrapper.setAttribute("data-expanded", false)
      })

      const input = search.input[0]
      const wrapper = input.closest(".DocsSearch")

      input.addEventListener("focus", () => {
        wrapper.setAttribute("is-focused", "")
      })

      input.addEventListener("blur", () => {
        wrapper.removeAttribute("is-focused")
      })

      document.addEventListener("keydown", event => {
        const slashShortcut = event.key === "/"
        const commandShortcut = event.key === "S" && event.shiftKey

        if (slashShortcut || commandShortcut) {
          event.preventDefault()
          window.scrollTo(0, 0)
          input.focus()
        }
      })
    }

    init()
  }, [])

  return (
    <>
      <Helmet>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/docsearch.js/2.6.3/docsearch.min.js"/>
      </Helmet>

      <div className="DocsSearch">
        <div className="DocsSearch--input-wrapper">
          <input id="DocsSearch--input" className="DocsSearch--input" type="text" spellCheck="false" autoComplete="false" placeholder={"Search " + DocsTitle() + " docs..."}/>
          <div className="DocsSearch--input-icon">
            <AccessibleSVG title="Search icon (depiction of a magnifying glass)" viewBox="0 0 16 16">
              <path d="M11.999 10.585l3.458 3.458a1 1 0 01-1.414 1.414L10.585 12a6.5 6.5 0 111.414-1.414zM6.75 11.5a4.75 4.75 0 100-9.5 4.75 4.75 0 000 9.5z"/>
            </AccessibleSVG>
          </div>
          <div className="DocsSearch--input-bottom-border"></div>
        </div>
      </div>
    </>
  )
}

export default DocsSearch
