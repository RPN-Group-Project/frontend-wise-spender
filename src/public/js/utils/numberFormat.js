export default function numberFormat(number) {
  return new Intl.NumberFormat("id-ID").format(number);
}
