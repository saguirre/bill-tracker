export const getCorrespondingThemeImage = (page: string, theme?: string) => {
  if (!theme) return `/images/${page}/${page}_light_dark.png`;

  switch (theme) {
    case 'light':
      return `/images/${page}/${page}_light_dark.svg`;
    case 'dark':
      return `/images/${page}/${page}_light_dark.svg`;
    case 'dracula':
      return `/images/${page}/${page}_dracula.svg`;
    case 'cupcake':
      return `/images/${page}/${page}_cupcake.svg`;
    case 'pastel':
      return `/images/${page}/${page}_pastel.svg`;
    case 'lofi':
      return `/images/${page}/${page}_lofi.svg`;
    case 'emerald':
      return `/images/${page}/${page}_emerald.svg`;
    default:
      return `/images/${page}/${page}_light_dark.svg`;
  }
};
