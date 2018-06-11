new Vue({
    el: '#app',
    data: {
        equation: '',
        current: '0',
    },
    methods: {
        allClearClick() {
            this._allClear()
        },
        numberClick(e) {
            const num = e.target.innerText

            this._newNumber(num)
        },
        operatorClick(e) {
            const op = e.target.innerText

            this._newOperator(op)
        },
        equalsClick() {
            this._equals()
        },
        decimalClick() {
            this._newDecimal()
        },
        _newNumber(num) {
            this.equation += num

            if (this.current.match(/[-+*/]|^0+/)) {  // if current is operator or a single '0'
                this.current = num
            } else {
                this.current += num
            }
        },
        _newOperator(op) {
            if (op == 'x') op = '*'    // change for equation purposes
            
            this.current = op   // update display

            if (this.equation.slice(-1).match(/[-+*/]/)) {   // if last character is an operator
                this.equation = this.equation.replace(/.$/, op)   // replace last equatino char with operator
            } else {
                this.equation += op
            }
        },
        _newDecimal() {
            if (this.current.match(/[.]/)) return;  // abort if last char is '.'

            this.equation += '.'
            
            if (this.current.match(/[-+*/]/)) {   // note: if '-' wasn't first you need to escape it because it's treated as a "range" character
                this.current = '.'
            } else {
                this.current += '.'
            }
        },
        _equals() {
            try {
                this.current = String(eval(this.equation) || 0)
            } catch (err) {
                console.error("Invalid equation")
            }
        },
        _allClear() {
            this.equation = ''
            this.current = '0'
        },
    },
    computed: {
        displayEquation() {
            return this.equation
                .replace(/[-+*/]/g, ' $& ')   // pad the operators with spaces  ('$&' is the match)
                .slice(0, 30)   // replace 'x''s and truncate before displaying
                
        },
        displayCurrent() {
            return this.current.slice(0, 13)   // truncate before displaying
        }
    },
    mounted() {
        //const app = this    // to use in event listener callback (otherwise "this" refers to window object)
        //..or use arrow function like below

        const $buttons = Array.from(this.$el.querySelectorAll('button'))  // make Array so I can use .find()

        window.addEventListener('keydown', e => {
            e.preventDefault()  // so "Enter" doesn't "resend" the focussed key (hidden by css 'outline: none')
            
            if (e.key.match(/^\d$/)) {  // match single digit by itself
                this._newNumber(e.key)

                // find the DOM button and add .flash-number css class
                const $button = $buttons.find(button => button.innerText == e.key)
                $button.classList.add('flash')
            }
            else if (e.key.match(/[-+*/]/)) {   // match operators
                this._newOperator(e.key)

                // adjust for user typing '*' but DOM element looking for contains 'x'
                let testKey = e.key
                if (e.key == '*') testKey = 'x'

                // find the DOM button and add .flash-number css class
                const $button = $buttons.find(button => button.innerText == testKey)
                $button.classList.add('flash')
            }
            else if (e.key == "Enter" || e.key == "=") {
                this._equals()
                this.$refs.equals.classList.add('flash')
            }
            else if (e.key == '.') {
                this._newDecimal()
                this.$refs.decimal.classList.add('flash')    
            }
            else if (e.key == 'c') {
                this._allClear()
                this.$refs.allClear.classList.add('flash')
            }
        })

        // remove the 'flash' class after it's reached the end of it's transition
        $buttons.forEach(button => button.addEventListener('transitionend', e => {
            e.target.classList.remove('flash')
        }))
    }
})