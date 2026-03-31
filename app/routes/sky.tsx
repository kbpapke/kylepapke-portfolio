import type { MetaFunction } from '@remix-run/node'
import { TerminalScene } from '~/components/terminal/TerminalScene'

export const meta: MetaFunction = () => [
  { title: 'Kyle Papke — Sky Terminal' },
  { name: 'description', content: 'Senior Software Engineer · Ann Arbor, MI · TypeScript, React, Golang, Web3, GraphQL' },
]

export default function Sky() {
  return <TerminalScene scene="sky" />
}

