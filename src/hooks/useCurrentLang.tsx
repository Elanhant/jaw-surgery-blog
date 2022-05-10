import * as React from "react"
import { Language } from "../../graphql-types"

export type CurrentLangContextValue = Language

export const CurrentLangContext =
  React.createContext<CurrentLangContextValue>("EN")

export function useCurrentLang() {
  return React.useContext(CurrentLangContext)
}
