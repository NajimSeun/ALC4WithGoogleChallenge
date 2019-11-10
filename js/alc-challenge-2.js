const supportedCards = {
    visan: "visa", mastercard: "masterccard"
};

const countries = [
    {
        code: "US",
        currency: "USD",
        currencyName: '',
        country: 'United States'
    },
    {
        code: "NG",
        currency: "NGN",
        currencyName: '',
        country: 'Nigeria'
    },
    {
        code: 'KE',
        currency: 'KES',
        currencyName: '',
        country: 'Kenya'
    },
    {
        code: 'UG',
        currency: 'UGX',
        currencyName: '',
        country: 'Uganda'
    },
    {
        code: 'RW',
        currency: 'RWF',
        currencyName: '',
        country: 'Rwanda'
    },
    {
        code: 'TZ',
        currency: 'TZS',
        currencyName: '',
        country: 'Tanzania'
    },
    {
        code: 'ZA',
        currency: 'ZAR',
        currencyName: '',
        country: 'South Africa'
    },
    {
        code: 'CM',
        currency: 'XAF',
        currencyName: '',
        country: 'Cameroon'
    },
    {
        code: 'GH',
        currency: 'GHS',
        currencyName: '',
        country: 'Ghana'
    }
];

let cardNumVisible = false;
const allowableKeys = [37, 38, 39, 40, 9];
const cardTypes = {
    isVisa: "is-visa",
    isMastercard: "is-mastercard"
};

const billHype = () => {
    const billDisplay = document.querySelector('.mdc-typography--headline4');
    if (!billDisplay) return;

    billDisplay.addEventListener('click', () => {
        const billSpan = document.querySelector("[data-bill]");
        if (billSpan &&
            appState.bill &&
            appState.billFormatted &&
            appState.billFormatted === billSpan.textContent) {
            window.speechSynthesis.speak(
                new SpeechSynthesisUtterance(appState.billFormatted)
            );
        }
    });
};
const appState = {};



const formatAsMoney = (amount, buyerCountry) => {

    const [usa, ...rest] = countries;
    const country = countries.find(country => country.country === buyerCountry);

    return country ?
        amount.toLocaleString(`en-${country.code}`, { style: "currency", currency: country.currency }) :
        amount.toLocaleString("en-us", { style: "currency", currency: usa.currency });

};

const flagIfInvalid = (field, isValid) => {
    field.classList.remove("is-invalid");
    if (!isValid)
        field.classList.add("is-invalid");
}

const expiryDateFormatIsValid = (field) => {
    const value = field.value.trim();
    if (value === "") {
        return false;
    }

    const regExp = RegExp(/[\d]{2}\/[\d]{2}/);
    return regExp.test("08/19");
}



///// ################################################### recent change
const detectCardType = (first4Digits) => {

    const cardContainer = document.querySelector("div[data-credit-card]");
    const cardLogo = document.querySelector("img[data-card-type]");

    if (first4Digits.startsWith("4")) {
        removeBothCardTypes(cardContainer)
        cardContainer.classList.add("is-visa");
        cardLogo.src = supportedCards.visa;
        return cardTypes.isVisa;

    } else if (first4Digits.startsWith("5")) {
        removeBothCardTypes(cardContainer);
        cardContainer.classList.add("is-mastercard");
        cardLogo.src = supportedCards.mastercard;
        return cardTypes.isMastercard;
    }
};

const removeBothCardTypes = (targetContainer) => {
    targetContainer.classList.remove("is-visa");
    targetContainer.classList.remove("is-mastercard");
}



///// ##############################  Recent change  ENNNNNND
const validateCardExpiryDate = () => {
    const expDateField = document.querySelector("#expiryDateInput");
    if (expiryDateFormatIsValid(expDateField) && isDateInFuture(expDateField.value)) {
        flagIfInvalid(expDateField, true);
        return true;
    } else {
        flagIfInvalid(expDateField, false);
        return false;
    }
};

const isDateInFuture = (expDate) => {
    if (expDate.trim() === "") {
        return false;
    }
    const today = new Date();
    const [month, year] = expDate.split("/");
    const monthInt = parseInt(month);
    const yearInt = parseInt(`20${year}`);
    //console.log(yearInt)
    const expiryDate = new Date(yearInt, monthInt);
    return ((expiryDate.getTime() - today.getTime()) > 1) ? true : false;


}


const validateCardHolderName = () => {
    const nameInput = document.querySelector("#nameInput");
    const name = nameInput.value.trim();
    const names = name.split(" ");
    console.log(names)
        ; if (names.length === 2) {
            if (names[0].trim().length >= 3 && names[1].trim().length >= 3) {
                flagIfInvalid(nameInput, true);
                return true;
            } else {
                flagIfInvalid(nameInput, false);
                return false;
            }

        } else {
        flagIfInvalid(nameInput, false);
        return false;
    }
};
const smartCursor = (event, fieldIndex, fields) => {
    const field = fields[fieldIndex];
    const value = field.value.trim();
    if (value.length === field.size) {
        const nextField = fields[fieldIndex + 1];
        if (nextField) {
            nextField.focus();
        }
    }
};

const enableSmartTyping = () => {
    const fields = document.querySelectorAll("input");
    
    fields.forEach((field, index, fields) => {
         
        field.addEventListener("keydown", (event) => {
            smartInput(event, index ,fields);
        })
    })
};

const smartInput = (event, fieldIndex , fields) => {

    if (fieldIndex < 4) {
        //console.log(event) ;
        handleCardNumber(event,fieldIndex,fields) ;

    } else if (fieldIndex === 4) {
        console.log(`${event.key} from name`)
        handleNameInput(event,fieldIndex,fields) ;
    } else if (fieldIndex === 5) {
        handleDateInput(event,fieldIndex,fields);
        console.log(`${event.key} from date`)

    }
    console.log(appState.cardDigits)
}

const handleCardNumber = (event, fieldIndex, fields) => {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
        event.preventDefault();
        addToCardDigits(event.key, fieldIndex, event);
        smartCursor(event, fieldIndex, fields);

        /// #################### NEW CODE ############################

        if (fieldIndex === 0 && appState.cardDigits[0].length === 4) {

            const first4Digits = (appState.cardDigits[0]).join('');
            detectCardType(first4Digits);
            console.log(first4Digits);
        }
        /// ################### NEW CODE  ###############################


    } else if (event.keyCode === 8) {
        if (appState.cardDigits[fieldIndex].length !== 0) {
            appState.cardDigits[fieldIndex] = appState.cardDigits[fieldIndex].slice(0, appState.cardDigits[fieldIndex].length - 1)
        }
    } else if (event.keyCode === 46) {

        const target = event.target;
        const pos = target.selectionStart;
        if (pos < 3) {
            const beforeArr = appState.cardDigits[fieldIndex].slice(0, pos);
            const afterArr = appState.cardDigits[fieldIndex].slice(pos + 1);
            const combine = [beforeArr, afterArr];
            appState.cardDigits[fieldIndex] = [].concat(...combine);
        }
    } else if (!allowableKeys.includes(event.keyCode)) {
        event.preventDefault();
    }
}
const handleNameInput = (event, fieldIndex, fields) => {
    let field4Allowables = [allowableKeys ,[32, 8, 46]];
    field4Allowables = [].concat(...field4Allowables);
    console.log(field4Allowables)
    if ((event.keyCode >= 65 && event.keyCode <= 90) || field4Allowables.includes(event.keyCode)) {

        setTimeout(() => {
            smartCursor(event, fieldIndex, fields);
        } , 200)
        
    } else {
        event.preventDefault();
    }
}
const handleDateInput = (event , fieldIndex , fields) => {
    let field5Allowables = [allowableKeys, [191,8,46]];
    console.log("in date handler")
    field5Allowables = [].concat(...field5Allowables);
    if ((event.keyCode >= 48 && event.keyCode <= 57) || field5Allowables.includes(event.keyCode )) {
        console.log(event.key)
        smartCursor(event, fieldIndex, fields);
    } else {
        //console.log(event.key)
        event.preventDefault();
    }
}
const addToCardDigits = (num, fieldIndex, { target }) => {

    if (appState.cardDigits.length !== 0) {
        const fArray = appState.cardDigits[fieldIndex];
        pushToArray(num, fArray);
        swapDigit(num, target, fieldIndex);
        console.log(appState.cardDigits);

    } else {
        appState.cardDigits = [[], [], [], []];
        const fArray = appState.cardDigits[fieldIndex];
        pushToArray(num, fArray);
        console.log(appState.cardDigits);
        swapDigit(num, target, fieldIndex);



    }
}

const pushToArray = (num, fArray) => {
    //console.log(fArray)
    if (fArray.length !== 4) {
        fArray.push(parseInt(num));

    }

}

const swapDigit = (num, target, fieldIndex) => {
    target.value = `${target.value}${num}`;

    if (fieldIndex < 3 && !cardNumVisible  ) {
        setTimeout(() => {
            const hashes = target.value.slice(0, target.value.length - 1);
            target.value = `${hashes}#`;
        }, 500);
    }
}

const validatePayment = () => {
    validateCardNumber();
    validateCardHolderName();
    validateCardExpiryDate();
}

const uiCanInteract = () => {
    const firstInput = document.querySelector("#fourthInput");
    const payBut = document.querySelector("[data-pay-btn]");
    firstInput.focus();
    payBut.addEventListener("click", validatePayment);
    billHype();
    const cardNumVisibility = document.querySelector(".card-num-visibility") ;
    cardNumVisibility.addEventListener("click" , toggleCardNumberVisibility ) ;
    enableSmartTyping();

};

 

const displayCartItemsAndTotal = ({ results }) => {
    const [data, ...rest] = results;
    const { itemsInCart, buyerCountry } = data;
    appState.items = itemsInCart;
    appState.country = buyerCountry;
    appState.bill = itemsInCart.reduce((total, item) => total + (item.price * item.qty), 0);

    appState.billFormatted = formatAsMoney(appState.bill, appState.country);
    const spanDataBill = document.querySelector(".total-amount");
    spanDataBill.textContent = appState.billFormatted;
    appState.cardDigits = [];
    displayCartItems(appState);
    uiCanInteract();

};

const toggleCardNumberVisibility = (event) => {
    console.log("called toggle")
    const ie = document.querySelector(".card-num-visibility");
    if (!cardNumVisible) {
        ie.classList.remove("fa-eye");
        ie.classList.add("fa-eye-slash");
        cardNumVisible = true;
        showCardNumbers();

    } else {
        ie.classList.remove("fa-eye-slash");
        ie.classList.add("fa-eye");
        cardNumVisible = false;
        hideCardNumbers();
    }
}

const showCardNumbers = () => {

const digitsInputs = document.querySelectorAll("[data-cc-digits] input") ;
digitsInputs.forEach((input , index) =>{
    input.value = appState.cardDigits[index].join("") ;
    smartCursor(null,index,digitsInputs);
})

}


const hideCardNumbers = () => {
    const digitsInputs = document.querySelectorAll("[data-cc-digits] input") ;
    digitsInputs.forEach((input , index) =>{
        const num  = appState.cardDigits[index].length ;
        input.value = generateHashes(num);
        smartCursor(null,index,digitsInputs);
    })

}

const generateHashes = (num) => {
    let hashes = "";
    for(let i = 0 ; i < num ; i++){
       hashes = `${hashes}#`;
    }
    return hashes ;
}
const displayCartItems = (appState) => {


    const itemContainer = document.querySelector(".items");

    const markup = appState.items.map((item) => {
        console.log(item)

        return ` <div class="items-container clearfix">
    <h4 class="item">${item.name}</h4>
			
	<h4 class="item-price">${formatAsMoney(item.price * item.qty, appState.country)}</h4>
	<h4 class="item qty">${item.qty}</h4>
</div>`});
    itemContainer.innerHTML = markup.join(" ");
    console.log(markup)
}







//// ######################################  New change ###############################

////////// LUHN OOOOOOOOOOOOOOO

const validateWithLuhn = (digits) => {
    const sum = luhnStep3(luhnStep1$2(digits));
    return (sum % 10 === 0) ? true : false;
}

const luhnStep1$2 = (digits) => {
    for (let i = (digits.length - 2); 0 <= i; i = i - 2) {
        digits[i] = digits[i] * 2;
        if (digits[i] > 9) {
            digits[i] = digits[i] - 9;
        }
    }
    return digits;
}

const luhnStep3 = (digits) => {
    return digits.reduce((acc, cur) => acc + cur);
}
/////// LUHN OOOOOOOOOOOOOOO
/////// #######################################m NEW Code ###################################

const validateCardNumber = () => {



    const cc_digits = document.querySelector("[data-cc-digits]");


    const digits = appState.cardDigits.flat();

    const outcome = validateWithLuhn(digits);
    outcome ? cc_digits.classList.remove("is-invalid") :
        cc_digits.classList.add("is-invalid");

    return outcome;

}

////// ################################################ New Change ##################################



const fetchBill = () => {
    const apiHost = 'https://randomapi.com/api';
    const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
    const apiEndpoint = `${apiHost}/${apiKey}`;
    //console.log(apiEndpoint)
    fetch(apiEndpoint).then(response => response.json()).then((data) => {
        displayCartItemsAndTotal(data)
    }).catch(error => console.log("Error fetching data from server"));
};

const startApp = () => {

    fetchBill() ;
    //appState.cardDigits = [];
   // enableSmartTyping()


};

startApp();