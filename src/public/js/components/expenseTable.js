import dateFormater from "../utils/dateFormater.js";
import numberFormat from "../utils/numberFormat.js";
const expenseTableBody = (date, category, amount, description) => {
  return `<tr class="bg-white border-b">
                    <td
                      class="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      ${dateFormater(date)}
                    </td>
                    <td
                      class="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap"
                    >
                      <a
                        href="./category.html"
                        class="underline underline-offset-[3px] text-blue-800 hover:text-zinc-500 hover:no-underline hover:bg-[url(&#x27;https://snippets.alexandru.so/squiggle.svg&#x27;)]"
                      >
                        ${category}
                      </a>
                    </td>
                    <td
                      class="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap"
                    >
                      ${numberFormat(amount)}
                    </td>
                    <td
                      class="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap"
                    >
                      ${description}
                    </td>
                  </tr>`;
};

export default expenseTableBody;
