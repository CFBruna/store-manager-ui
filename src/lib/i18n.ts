const CATEGORY_TRANSLATIONS: Record<string, string> = {
  electronics: 'Eletrônicos',
  jewelery: 'Joalheria',
  "men's clothing": 'Moda Masculina',
  "women's clothing": 'Moda Feminina',
}

const PRODUCT_TRANSLATIONS: Record<
  number,
  { title: string; description: string }
> = {
  1: {
    title: 'Mochila Foldsack No. 1 - 15 Polegadas',
    description:
      'Sua mochila perfeita para uso diário e caminhadas na floresta. Protege seu laptop (até 15 polegadas) na bolsa acolchoada.',
  },
  2: {
    title: 'Camiseta Masculina Premium Slim Fit',
    description:
      'Estilo slim fit, manga longa raglan contrastante, carcela de três botões leve e tecido macio para um uso confortável e respirável.',
  },
  3: {
    title: 'Jaqueta Algodão Masculina',
    description:
      'Ótimas jaquetas para Primavera/Outono/Inverno, adequadas para muitas ocasiões, como trabalho, caminhadas, camping ou uso diário.',
  },
  4: {
    title: 'Camiseta Masculina Casual Slim Fit',
    description:
      'O peito e os ombros estreitos com a cintura forrada dão um visual limpo e slim. Feito de tecido leve e durável.',
  },
  5: {
    title: 'Pulseira de Corrente John Hardy Masculina',
    description:
      'Inspirada na textura clássica da nossa coleção Chain, esta pulseira John Hardy Naga é feita à mão com prata de lei e safira preta.',
  },
  6: {
    title: 'Bracelete de Ouro Solid Gold Petite Micropave ',
    description:
      'Projetada e vendida pelo Hafeez Center nos Estados Unidos. Satisfação Garantida. Devolva ou troque qualquer pedido em 30 dias.',
  },
  7: {
    title: 'Anel Princess Banhado a Ouro Branco',
    description:
      'Anel de noivado solitário clássico em diamante Royal Princess para ela. Presentes para mimar seu amor mais noivado, casamento, aniversário...',
  },
  8: {
    title: 'Brincos de Pierced Owl em Ouro Rosa',
    description:
      'Brincos de túnel alargados duplos banhados a ouro rosa. Feito de aço inoxidável 316L.',
  },
  9: {
    title: 'HD Externo Portátil WD 2TB Elements',
    description:
      'Compatibilidade com USB 3.0 e USB 2.0. Transferências de dados rápidas. Melhora o desempenho do PC. Alta capacidade.',
  },
  10: {
    title: 'SSD Interno SanDisk SSD PLUS 1TB',
    description:
      'Atualização fácil para inicialização, desligamento e resposta de aplicativos mais rápidos. Aumenta o desempenho de gravação em rajada.',
  },
  11: {
    title: 'SSD Silicon Power 256GB 3D NAND A55',
    description:
      'Flash 3D NAND aplicado para oferecer altas velocidades de transferência. Velocidades notáveis que permitem inicialização mais rápida.',
  },
  12: {
    title: 'HD Externo para Gaming WD 4TB PS4',
    description:
      'Expanda sua experiência de jogo no PS4. Jogue em qualquer lugar. Configuração rápida e fácil. Design elegante.',
  },
  13: {
    title: 'Monitor Acer SB220Q bi 21.5" Full HD',
    description:
      'Visor IPS widescreen de 21,5 polegadas Full HD (1920 x 1080) e tecnologia Radeon Free Sync. Design ultrafino.',
  },
  14: {
    title: 'Monitor Gaming Curvo Samsung 49" CHG90',
    description:
      'Monitor de jogos curvo super ultrawide de 49 polegadas 32:9 com tela dupla de 27 polegadas lado a lado. Tecnologia QLED.',
  },
  15: {
    title: 'Jaqueta de Neve Feminina 3 em 1 BIYLACLESEN',
    description:
      'Jaqueta com forro removível. Tecido de lã quente. Jaqueta com gola alta, mantém você aquecido no tempo frio.',
  },
  16: {
    title: 'Jaqueta de Couro Sintético Feminina com Capuz',
    description:
      'Material de couro sintético para estilo e conforto. Jaqueta de couro sintético com estilo denim e capuz removível.',
  },
  17: {
    title: 'Capa de Chuva Feminina Listrada Windbreaker',
    description:
      'Leve, perfeita para viagens ou uso casual. Manga comprida com capuz e design de cintura ajustável. Forro listrado.',
  },
  18: {
    title: 'Blusa Feminina MBJ Manga Curta Gola V',
    description:
      '95% Rayon 5% Spandex. Tecido leve com grande elasticidade para conforto. Costura dupla na bainha inferior.',
  },
  19: {
    title: 'Camiseta Feminina Opna Manga Curta Moisture',
    description:
      '100% poliéster. Lavagem à máquina. Tecido leve, espaçoso e altamente respirável com tecido de absorção de umidade.',
  },
  20: {
    title: 'Camiseta Feminina DANVOUY Casual Algodão',
    description:
      '95% Algodão, 5% Spandex. Características: Casual, Manga Curta, Estampa de Letras, Gola V. O tecido é macio.',
  },
}

export function translateCategory(category: string): string {
  const normalized = category.toLowerCase().trim()
  return CATEGORY_TRANSLATIONS[normalized] || category
}

export function translateProduct(
  id: number,
  originalTitle: string,
  originalDescription: string,
) {
  const translation = PRODUCT_TRANSLATIONS[id]
  return {
    title: translation?.title || originalTitle,
    description: translation?.description || originalDescription,
  }
}
