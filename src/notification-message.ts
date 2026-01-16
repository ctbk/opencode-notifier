import { renderTemplate } from "./template"
import type { TemplateContext } from "./template"
import type { TemplateContextOptions } from "./template-context"
import { buildTemplateContext } from "./template-context"

export interface NotificationMessageOptions {
  template: string
  context?: TemplateContext
  contextOptions?: TemplateContextOptions
  buildContext?: typeof buildTemplateContext
  render?: typeof renderTemplate
}

export async function renderNotificationMessage(
  options: NotificationMessageOptions
): Promise<string> {
  const {
    template,
    context,
    contextOptions = {},
    buildContext = buildTemplateContext,
    render = renderTemplate,
  } = options

  try {
    const effectiveContext = context ?? (await buildContext(contextOptions))
    return render(template, effectiveContext)
  } catch (error) {
    console.debug("[opencode-notifier] Failed to render notification message.", error)
    return template
  }
}
