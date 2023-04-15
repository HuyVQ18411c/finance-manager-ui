let CATEGORIES = null;

function getExpenseFields(categories, isForm = true) {
    let expenseFields = [
        {
            name: "title",
            title: "Tiêu đề",
            required: true,
            type: "text",
        },
        {
            name: "amount",
            title: "Lượng tiền",
            required: true,
            type: "number",
        },
        {
            name: "spent_date",
            title: "Ngày chi tiêu",
            required: false,
            type: "date",
        },
        {
            name: "category_id",
            title: "Loại chi tiêu",
            required: false,
            type: "select",
            children: categories,
        },
        {
            name: "description",
            title: "Mô tả",
            required: false,
            type: "textarea",
        },
    ];

    if (!isForm) {
        const fields = {
            id: {
                title: "STT",
            },
        };
        expenseFields.forEach((obj) => {
            fields[obj.name] = {
                title: obj.title,
            };

            if (obj.name === "category_id") {
                fields["category_id"]["mapping"] = categories;
            }
        });
        return fields;
    }

    return expenseFields;
}

async function getExpenseFormFields() {
    if (isBlank(CATEGORIES)) {
        CATEGORIES = await getJSONData("categories/");
    }

    const adaptedCategoriesData = selectAdapter(CATEGORIES, "id", "name");

    return getExpenseFields(adaptedCategoriesData);
}

async function getExpenseTableFields() {
    if (isBlank(CATEGORIES)) {
        CATEGORIES = await getJSONData("categories/");
    }

    const fields = getExpenseFields(CATEGORIES, (isForm = false));
    return fields;
}

function getBudgetTableFields(isForm = true) {
    let budgetFields = [
        {
            name: "source",
            title: "Nguồn thu nhập",
            required: true,
            type: "text",
        },
        {
            name: "amount",
            title: "Lượng tiền",
            required: true,
            type: "number",
        },
        {
            name: "receive_date",
            title: "Ngày nhận",
            required: true,
            type: "date",
        },
        {
            name: "notes",
            title: "Ghi chú",
            required: false,
            type: "text",
        },
    ];

    if (!isForm) {
        const fields = {
            id: {
                title: "STT",
            },
        };
        budgetFields.forEach((obj) => {
            fields[obj.name] = {
                title: obj.title,
            };
        });
        return fields;
    }

    return budgetFields;
}

function createFormFields(parentElement, fields) {
    fields.forEach((field) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("mb-3");

        const label = document.createElement("label");
        label.innerText = field.title;
        label.classList.add("form-label");

        let formField = null;

        if (field.type === "select") {
            formField = document.createElement("select");
            formField.classList.add("form-select");
            field.children.forEach((children) => {
                const option = document.createElement("option");
                option.value = children.value;
                option.innerText = children.title;
                formField.appendChild(option);
            });
        } else if (field.type === "textarea") {
            formField = document.createElement("textarea");
            formField.classList.add("form-control");
        } else {
            formField = document.createElement("input");
            formField.classList.add("form-control");
        }

        formField.name = field.name;
        formField.id = field.name;
        formField.type = field.type;
        formField.required = field.required;

        if (field.type === "date") {
            formField.value = new Date().toISOString().slice(0, 10);
        }

        wrapper.appendChild(label);
        wrapper.appendChild(formField);

        parentElement.appendChild(wrapper);
    });
}

async function addExpenseRow(parentElement, data, index = null) {
    const fields = await getExpenseTableFields();

    const newRow = document.createElement("tr");
    newRow.id = data.id;

    Object.keys(fields).forEach((key) => {
        const newCol = document.createElement("td");
        if (!isBlank(index) && key === "id") {
            newCol.innerText = index + 1;
        } else if (key === "amount") {
            newCol.innerText = data[key]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else if (key === "category_id") {
            newCol.innerText = fields[key].mapping.filter(
                (cate) => cate.id === data.category_id
            )[0].name;
        } else {
            newCol.innerText = data[key];
        }

        newRow.appendChild(newCol);
    });

    parentElement.appendChild(newRow);
    return newRow;
}

function addBudgetRow(parentElement, data, index = null) {
    const fields = getBudgetTableFields(false);

    const newRow = document.createElement("tr");
    newRow.id = data.id;

    Object.keys(fields).forEach((key) => {
        const newCol = document.createElement("td");

        if (!isBlank(index) && key === "id") {
            newCol.innerText = index + 1;
        } else if (key === "amount") {
            newCol.innerText = data[key]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else if (key === "source") {
            newCol.innerText = data.source.name;
        } else {
            newCol.innerText = data[key] || "--";
        }
        newRow.appendChild(newCol);
    });

    parentElement.appendChild(newRow);
    return newRow;
}

async function createExpensesTable(bodyElement, data) {
    data.forEach((row, index) => {
        addExpenseRow(bodyElement, row, index);
    });
}

function getCacheCategories() {
    return CATEGORIES;
}

function createBudgetTable(bodyElement, data) {
    data.forEach((row, index) => {
        addBudgetRow(bodyElement, row, index);
    });
}
