$(document).ready(function() {
    const moneyInput = new AutoNumeric('#expense-input', {
        currencySymbol: 'Rp ',
        decimalCharacter: "," ,
        digitGroupSeparator: '.',
        currencySymbolPlacement: 'p',
        modifyValueOnWheel: false, 
        unformatOnSubmit: true,
        decimalPlaces: 0 
    });
    
    $('#expense-form').on('submit', function(event) {
        event.preventDefault();
    
        let inputValue = moneyInput.getNumericString();

        let numericValue = parseInt(inputValue)
    
    
    });
});