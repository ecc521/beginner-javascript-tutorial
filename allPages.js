self.order = [
    ["", "Beginner JavaScript"], //Same as index.html
    ["lesson1.html", "Lesson 1: Interacting with the User"],
    ["lesson2.html", "Lesson 2: JavaScript in a webpage"],
    ["lesson3.html", "Lesson 3: Editing Code"],
    ["lesson4.html", "Lesson 4: Adding Logic to make Decisions"],
    ["lesson5.html", "Lesson 5: Adding Logic"],
    ["lesson6.html", "Lesson 6: Writing Code"],
    ["lesson7.html", "Lesson 7: The Usage of JavaScript"],
    ["lesson8.html", "Lesson 8: Creating an HTML Element"],
    ["lesson9.html", "Lesson 9: Creating an HTML Element"],
    ["lesson10.html", "Lesson 10: Creating an HTML Element"],
    ["lesson11.html", "Lesson 11: Interactive Websites"],
    ["lesson12.html", "Lesson 12: Functions"],
    ["lesson13.html", "Lesson 13: Functions"],
    ["lesson14.html", "Lesson 14: Functions"],
    ["lesson15.html", "Lesson 15: Functions"],
    ["lesson16.html", "Lesson 16: Editing Code"],
    ["lesson17.html", "Lesson 17: Interactive Websites: Calculator"],
    ["lesson18.html", "Lesson 18: Interacting with HTML and CSS"],
    ["lesson19.html", "Lesson 19: Arrays"],
    ["lesson20.html", "Lesson 20: document.querySelector"],
    ["lesson21.html", "Lesson 21: document.querySelectorAll"],
    ["continuing.html", "Continuing With JavaScript"],
]


//Don't run this code inside the serviceworker
if (self.window !== undefined) {

    self.currentLesson = window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1)

    var currentIndex;
    for (var i=0;i<self.order.length;i++) {
        if (self.order[i][0] === self.currentLesson) {
            currentIndex = i
            break
        }
    }

    self.nextLesson = window.location.href.replace(self.currentLesson, self.order[currentIndex + 1][0])
    self.previousLesson = window.location.href.replace(self.currentLesson, self.order[currentIndex - 1][0])

    //Only set header if a name is provided
    if (self.order[currentIndex][1] !== undefined) {
        var h1 = document.createElement("h1")
        h1.innerHTML = self.order[currentIndex][1]
        document.body.insertBefore(h1, document.body.firstChild)
    }


    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js');
        });
    }


    //IE 8 attachEvent polyfill

    !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    	WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
    		var target = this;

    		registry.unshift([target, type, listener, function (event) {
    			event.currentTarget = target;
    			event.preventDefault = function () { event.returnValue = false };
    			event.stopPropagation = function () { event.cancelBubble = true };
    			event.target = event.srcElement || target;

    			listener.call(target, event);
    		}]);

    		this.attachEvent("on" + type, registry[0][3]);
    	};

    	WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
    		for (var index = 0, register; register = registry[index]; ++index) {
    			if (register[0] == this && register[1] == type && register[2] == listener) {
    				return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
    			}
    		}
    	};

    	WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
    		return this.fireEvent("on" + eventObject.type, eventObject);
    	};
    })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
}
