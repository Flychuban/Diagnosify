/*
* Note: it returns the url without tthe trailing comma example http://localhost:3000/api -> http://localhost:3000 and not http://localhost:3000/
*/
export function getBaseUrl(href: string) {
    let indexOfThirdSlash = 0;
    let slashesCount = 0;
    let iter = 0;
    while (true) {
        indexOfThirdSlash++;
        if (href[iter] === '/') { 
            slashesCount++;
            if (slashesCount === 3) {
                break;
            }
        }
        iter += 1;
        if (iter === href.length && slashesCount 
            == 2
        ) {
            return href;
        }
    }

    return href.substring(0, indexOfThirdSlash - 1)

}