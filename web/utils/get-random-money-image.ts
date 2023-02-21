export const getRandomMoneyImage = () => {
  const images = [
    'money_1.svg',
    'money_2.svg',
    'money_3.svg',
    'money_4.svg',
    'money_5.svg',
    'money_6.svg',
    'money_7.svg',
    'money_8.svg',
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return `/images/money/${images[randomIndex]}`;
};
