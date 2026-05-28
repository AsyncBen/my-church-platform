import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const groups = [
    { name: 'Youth Ministry', description: 'Empowering the next generation', accent: '#F59E0B' },
    { name: 'Worship Team', description: 'Leading hearts into worship', accent: '#8B5CF6' },
    { name: 'Media Team', description: 'Capturing and sharing God\'s glory', accent: '#10B981' },
    { name: 'Men Fellowship', description: 'Brothers standing firm in faith', accent: '#1B3A7A' },
    { name: 'Women Fellowship', description: 'Women of valor, grace and strength', accent: '#EC4899' },
    { name: 'Children Ministry', description: 'Nurturing young hearts for Christ', accent: '#F97316' },
  ]
  
  for (const group of groups) {
    await prisma.ministryGroup.upsert({
      where: { name: group.name } as any,
      update: {},
      create: group,
    })
  }
  console.log('Ministry groups seeded')
}

main().catch(console.error).finally(() => prisma.$disconnect())