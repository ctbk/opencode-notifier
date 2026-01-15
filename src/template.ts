export type TemplateValue = string | number | boolean | null | undefined

export interface TemplateContext {
  [key: string]: TemplateValue
}

const TOKEN_PATTERN = /\{([^{}]+)\}/g

export function renderTemplate(template: string, context: TemplateContext = {}): string {
  return template.replace(TOKEN_PATTERN, (_fullMatch, token) => {
    const value = context[token]
    if (value === undefined || value === null) {
      return ""
    }

    return String(value)
  })
}
