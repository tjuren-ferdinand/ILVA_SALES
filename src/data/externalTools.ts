import {
  type LucideIcon,
  MessageSquare,
  Calculator,
  Pencil,
  Clock,
  Languages,
  Mail,
  Monitor,
} from 'lucide-react'

export type ExternalTool = {
  title: string
  description: string
  href?: string
  file?: string
  command?: string
  icon: LucideIcon
}

export const externalTools: ExternalTool[] = [
  {
    title: 'Chat / Kundservice',
    description: 'Öppna kundservice och hantera kundärenden.',
    href: 'https://kundeservice.ilva.dk/auth/v3/signin?return_to=https%3A%2F%2Fiddesign.zendesk.com%2Fagent%2Fdashboard&role=agent',
    icon: MessageSquare,
  },
  {
    title: 'Resurs Kalkylator',
    description: 'Kalkylator och prisinformation från Resurs.',
    href: 'https://priceinfo.resurs.com/prisskyltning.html?countryCode=SE&authorizedBankproductId=IK556069&storeId=300500&representativeId=300500&creditAmount=0',
    icon: Calculator,
  },
  {
    title: 'Hammel Ritprogram',
    description: 'Öppna Hammels 3D-ritverktyg.',
    href: 'https://hammel.3dconfig.dk/tool/',
    icon: Pencil,
  },
  {
    title: 'Timesalg ILVA',
    description: 'Se försäljning och försäljningsdata.',
    href: 'https://timesalg.ilva.net/rpt_salg_daglig_time_SEK.htm',
    icon: Clock,
  },
  {
    title: 'Översätt',
    description: 'Översätt mellan danska och svenska.',
    href: 'https://translate.google.com/?sl=da&tl=sv&op=translate',
    icon: Languages,
  },
  {
    title: 'Mail',
    description: 'Öppna ILVA Webmail.',
    href: 'https://webmail.ilva.dk/owa/auth/logon.aspx?replaceCurrent=1&url=https%3a%2f%2fwebmail.ilva.dk%2fowa%2f',
    icon: Mail,
  },
  {
    title: 'AX Affärssystem',
    description: 'Öppna AX2012 (ILVA) via Remote Desktop.',
    file: 'C:\\Users\\SEHAL05\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\ILVA (RADC)\\AX2012 (ILVA).lnk',
    command: 'cmd /c start "" "C:\\Users\\SEHAL05\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\ILVA (RADC)\\AX2012 (ILVA).lnk"',
    icon: Monitor,
  },
]
