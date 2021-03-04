document.addEventListener('DOMContentLoaded', () => {
    const insertBtn = document.getElementById("insert");
    const clearBtn = document.getElementById("clear");
    const copyBtn = document.getElementById("copy");
    const list = document.getElementById("list");
    const confirmationIcon = document.getElementById("confirm-icon");
    //let productTitle = document.getElementById("product_title");
    insertBtn.addEventListener("click", insert);
    clearBtn.addEventListener("click", clear);
    copyBtn.addEventListener("click", copy);
    list.addEventListener("dblclick", remove);


    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        function (tabs) {
            if (tabs[0].url.includes("terminalx.com")) {
                load();
            } else {
                document.getElementById("htm").hidden = true;
            }
        });


    function save() {
        var i;
        var lst = [];

        for (i = 0; i < list.options.length; i++) {
            lst[i] = (list.options[i].text);
        }

        chrome.storage.sync.set({"key": lst}, function () {
        });
    }

    function load() {
        chrome.storage.sync.get(["key"], function (items) {
            items.key.forEach(item => addToList(item, false));
        });
    }

    function addToList(id, checkIfExist = true) {
        var option = document.createElement("option");
        option.text = id;

        if (!checkIfExist) {
            list.add(option);
        } else if (!isExist(id)) {
            list.add(option);
            showConfirmation();
        } else {
            insertBtn.innerText = "The Product Already Exist!";
            insertBtn.style.background = "#007cba";
            setTimeout(function () {
                insertBtn.innerHTML = "Add The Current Product";
                insertBtn.style.background = "black";
                insertBtn.style.borderColor = "black";
            }, 2000);
        }
    }

    function isExist(id) {
        var i;
        for (i = 0; i < list.options.length; i++) {
            if (list.options[i].text === id) {
                return true;
            }
        }
        return false;
    }

    function insert() {
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
            function (tabs) {
                var href = tabs[0].url;

                if (href.includes("terminalx.com")) {

                    var match = href.matchAll("\\/x\\d{8,11}[\\/|#]{0,1}");
                    var val = match.next().value;


                    if (val == null) {
                        invalidProductOp();
                    } else {
                        var id = val[0]
                        var len = id.length;
                        var lastChar = id.charAt(len - 1);
                        if (lastChar === '#' || lastChar === '/') {
                            id = id.slice(1, -1);
                        } else {
                            id = id.slice(1);
                        }
                        addToList(id);
                        save();
                    }
                } else {
                    alert("Error, you must be inside terminal X website.")
                }
            }
        );
    }

    function invalidProductOp() {
        insertBtn.innerText = "Invalid Product Page!";
        insertBtn.style.background = "#007cba";
        setTimeout(function () {
            insertBtn.innerText = "Add The Current Product";
            insertBtn.style.background = "black";
            insertBtn.style.borderColor = "black";
        }, 2000);
    }

    function showConfirmation() {
        insertBtn.innerText = "Product Added!";
        insertBtn.style.background = "#248f24";
        setTimeout(function () {
            insertBtn.innerText = "Add The Current Product";
            insertBtn.style.background = "black";
            insertBtn.style.borderColor = "black";
        }, 2000);
    }

    function clear() {
        var count = list.options.length;
        if (count > 0) {
            if (confirm("Are you sure that you want to delete " + count + " items from the list?")) {
                list.innerHTML = "";
                save();
            }
        }
    }

    function remove() {
        var toRemove = list.options.selectedIndex;
        var newList = [];
        var i;

        for (i = 0; i < list.options.length; i++) {
            if (i !== toRemove) {
                newList.push(list.options[i].text);
            }
        }

        list.innerHTML = "";

        for (i = 0; i < newList.length; i++) {
            addToList(newList[i]);
        }
        save();
    }

    function copy() {
        var i;
        var res = "";

        for (i = 0; i < list.options.length; i++) {
            res += list.options[i].text;
            res += '\n';
        }

        navigator.clipboard.writeText(res).then(function () {
            copyBtn.innerText = "Copied!";
            copyBtn.style.background = "#007cba";
            setTimeout(function () {
                copyBtn.innerText = "Copy List";
                copyBtn.style.background = "#6c757d";
            }, 2000);
        })
    }
})
;




