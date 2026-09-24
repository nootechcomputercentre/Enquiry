/* =========================================================
   Nootech Computer Centre Enquiry Form
   DIRECT SUBMISSION CONTROLLER
   ========================================================= */

/*
 * IMPORTANT:
 * This version intentionally does NOT use:
 * - fetch()
 * - CORS
 * - JSONP
 * - hidden iframes
 * - postMessage()
 * - polling
 * - timeout-based success detection
 *
 * The browser submits the form directly to the Apps Script
 * Web App as a normal HTML POST.
 *
 * Apps Script saves the enquiry and returns the Thank You
 * page containing the REAL Enquiry ID.
 */


/* =========================================================
   GOOGLE APPS SCRIPT URL
   ========================================================= */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby-Zk32-SUcV_DKrIIN_RznmKJDInx-ZSLwQJe4Os4_F1JpxwEwlGGc6PPZ0bmpZ4O6rg/exec";


/* =========================================================
   APPLICATION INITIALIZATION
   ========================================================= */

function initializeEnquiryForm() {

    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const enquiryForm =
        document.getElementById("enquiryForm");

    const submitButton =
        document.getElementById("submitButton");

    const buttonText =
        document.getElementById("buttonText");

    const loadingSpinner =
        document.getElementById("loadingSpinner");

    const enquiryMessage =
        document.getElementById("enquiryMessage");

    const characterCounter =
        document.getElementById("characterCounter");

    const mobileInput =
        document.getElementById("mobile");


    /* =====================================================
       FORM CHECK
       ===================================================== */

    if (!enquiryForm) {

        console.error(
            "NTC Enquiry Form not found."
        );

        return;
    }


    /* =====================================================
       LOADING STATE
       ===================================================== */

    function setLoading(loading) {

        if (submitButton) {

            submitButton.disabled =
                loading;
        }


        if (loading) {

            if (submitButton) {

                submitButton.classList.add(
                    "loading"
                );
            }


            if (buttonText) {

                buttonText.textContent =
                    "SUBMITTING...";
            }


            if (loadingSpinner) {

                loadingSpinner.style.display =
                    "inline-block";
            }

        }

        else {

            if (submitButton) {

                submitButton.classList.remove(
                    "loading"
                );
            }


            if (buttonText) {

                buttonText.textContent =
                    "SEND ENQUIRY";
            }


            if (loadingSpinner) {

                loadingSpinner.style.display =
                    "";
            }
        }
    }


    /* =====================================================
       SHOW FIELD ERROR
       ===================================================== */

    function showError(
        fieldId,
        message
    ) {

        const field =
            document.getElementById(
                fieldId
            );


        const error =
            document.getElementById(
                fieldId + "Error"
            );


        if (field) {

            field.classList.add(
                "input-error"
            );
        }


        if (error) {

            error.textContent =
                message;
        }
    }


    /* =====================================================
       CLEAR ALL ERRORS
       ===================================================== */

    function clearErrors() {

        document
            .querySelectorAll(
                ".input-error"
            )
            .forEach(
                function (element) {

                    element.classList.remove(
                        "input-error"
                    );

                }
            );


        document
            .querySelectorAll(
                ".error-message"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        "";

                }
            );
    }


    /* =====================================================
       ADD / UPDATE HIDDEN FIELD
       ===================================================== */

    function addHiddenField(
        name,
        value
    ) {

        /*
         * Remove duplicate hidden fields with the
         * same name.
         *
         * This is especially important for batchType.
         */

        const existingInputs =
            enquiryForm.querySelectorAll(
                'input[type="hidden"][name="' +
                name +
                '"]'
            );


        let input = null;


        if (existingInputs.length > 0) {

            input =
                existingInputs[0];


            for (
                let i = 1;
                i < existingInputs.length;
                i++
            ) {

                existingInputs[i].remove();
            }

        }

        else {

            input =
                document.createElement(
                    "input"
                );


            input.type =
                "hidden";


            input.name =
                name;


            enquiryForm.appendChild(
                input
            );
        }


        input.value =
            value === null ||
            value === undefined
                ? ""
                : String(value);
    }


    /* =====================================================
       GET BATCH TYPE VALUE
       ===================================================== */

    function getBatchTypeValue() {

        let value = "";


        /*
         * OPTION 1
         * Current field:
         *
         * name="batchType"
         */

        const checkedBatchType =
            document.querySelector(
                'input[name="batchType"]:checked'
            );


        if (checkedBatchType) {

            value =
                String(
                    checkedBatchType.value || ""
                ).trim();
        }


        /*
         * OPTION 2
         * Old field:
         *
         * name="trainingType"
         *
         * This keeps compatibility with your
         * previous HTML.
         */

        if (!value) {

            const checkedTrainingType =
                document.querySelector(
                    'input[name="trainingType"]:checked'
                );


            if (checkedTrainingType) {

                value =
                    String(
                        checkedTrainingType.value || ""
                    ).trim();
            }
        }


        /*
         * OPTION 3
         *
         * select/input with:
         *
         * id="batchType"
         */

        if (!value) {

            const batchTypeElement =
                document.getElementById(
                    "batchType"
                );


            if (
                batchTypeElement &&
                typeof batchTypeElement.value !==
                    "undefined"
            ) {

                value =
                    String(
                        batchTypeElement.value || ""
                    ).trim();
            }
        }


        return value;
    }


    /* =====================================================
       FORM VALIDATION
       ===================================================== */

    function validateForm() {

        let valid = true;


        clearErrors();


        /* -------------------------------------------------
           STUDENT NAME
           ------------------------------------------------- */

        const studentName =
            document.getElementById(
                "studentName"
            );


        if (
            !studentName ||
            !studentName.value.trim()
        ) {

            showError(
                "studentName",
                "Please enter student name."
            );


            valid = false;
        }


        /* -------------------------------------------------
           GUARDIAN NAME
           ------------------------------------------------- */

        const guardianName =
            document.getElementById(
                "guardianName"
            );


        if (
            !guardianName ||
            !guardianName.value.trim()
        ) {

            showError(
                "guardianName",
                "Please enter guardian name."
            );


            valid = false;
        }


        /* -------------------------------------------------
           GUARDIAN TYPE
           ------------------------------------------------- */

        const guardianType =
            document.getElementById(
                "guardianType"
            );


        if (
            !guardianType ||
            !guardianType.value
        ) {

            showError(
                "guardianType",
                "Please select guardian type."
            );


            valid = false;
        }


        /* -------------------------------------------------
           MOBILE
           ------------------------------------------------- */

        const mobile =
            document.getElementById(
                "mobile"
            );


        if (
            !mobile ||
            !/^[6-9]\d{9}$/.test(
                mobile.value.trim()
            )
        ) {

            showError(
                "mobile",
                "Enter a valid 10-digit mobile number."
            );


            valid = false;
        }


        /* -------------------------------------------------
           EMAIL
           ------------------------------------------------- */

        const email =
            document.getElementById(
                "email"
            );


        if (
            email &&
            email.value.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                email.value.trim()
            )
        ) {

            showError(
                "email",
                "Please enter a valid email address."
            );


            valid = false;
        }


        /* -------------------------------------------------
           COURSE
           ------------------------------------------------- */

        const courseEnquiryFor =
            document.getElementById(
                "courseEnquiryFor"
            );


        if (
            !courseEnquiryFor ||
            !courseEnquiryFor.value
        ) {

            showError(
                "courseEnquiryFor",
                "Please select the course."
            );


            valid = false;
        }


        /* -------------------------------------------------
           BATCH TYPE
           -------------------------------------------------
           
           IMPORTANT:
           Apps Script expects:
           
           batchType
           
           This supports:
           
           1. name="batchType"
           2. name="trainingType"
           3. id="batchType"
           
           ------------------------------------------------- */

        const batchTypeValue =
            getBatchTypeValue();


        if (!batchTypeValue) {

            const error =
                document.getElementById(
                    "batchTypeError"
                );


            if (error) {

                error.textContent =
                    "Please select a Batch Type.";
            }


            valid = false;

        }

        else {

            /*
             * THIS IS THE CRITICAL FIX.
             *
             * Regardless of what the visible HTML
             * field is called, Apps Script will receive:
             *
             * batchType=<selected value>
             */

            addHiddenField(
                "batchType",
                batchTypeValue
            );
        }


        return valid;
    }


    /* =====================================================
       CHARACTER COUNTER
       ===================================================== */

    if (
        enquiryMessage &&
        characterCounter
    ) {

        characterCounter.textContent =
            enquiryMessage.value.length +
            " / 1000";


        enquiryMessage.addEventListener(
            "input",
            function () {

                characterCounter.textContent =
                    this.value.length +
                    " / 1000";

            }
        );
    }


    /* =====================================================
       MOBILE NUMBER INPUT
       ===================================================== */

    if (mobileInput) {

        mobileInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
                            0,
                            10
                        );

            }
        );
    }


    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    enquiryForm.addEventListener(
        "submit",
        function (event) {

            /*
             * Stop normal submission temporarily.
             *
             * Validation is performed first.
             */

            event.preventDefault();


            /* -------------------------------------------------
               VALIDATE
               ------------------------------------------------- */

            if (
                !validateForm()
            ) {

                const firstError =
                    document.querySelector(
                        ".input-error"
                    );


                if (firstError) {

                    firstError.focus();
                }


                return;
            }


            /* -------------------------------------------------
               CHECK APPS SCRIPT URL
               ------------------------------------------------- */

            if (
                !GOOGLE_SCRIPT_URL ||
                !GOOGLE_SCRIPT_URL.endsWith(
                    "/exec"
                )
            ) {

                alert(
                    "The enquiry system is not configured correctly."
                );


                return;
            }


            /* -------------------------------------------------
               RETURN URL
               ------------------------------------------------- */

            let returnUrl =
                window.location.href
                    .split("#")[0]
                    .split("?")[0];


            /* -------------------------------------------------
               SOURCE
               ------------------------------------------------- */

            addHiddenField(
                "source",
                "Facebook"
            );


            /* -------------------------------------------------
               RETURN URL
               ------------------------------------------------- */

            addHiddenField(
                "returnUrl",
                returnUrl
            );


            /* -------------------------------------------------
               FINAL BATCH TYPE CHECK
               ------------------------------------------------- */

            const finalBatchType =
                enquiryForm.querySelector(
                    'input[type="hidden"][name="batchType"]'
                );


            if (
                !finalBatchType ||
                !finalBatchType.value.trim()
            ) {

                setLoading(false);


                alert(
                    "Batch Type is required. Please select a Batch Type and try again."
                );


                return;
            }


            /* -------------------------------------------------
               DIRECT FORM SUBMISSION
               -------------------------------------------------

               NO fetch()
               NO CORS
               NO iframe
               NO JSONP
               NO postMessage()
               NO polling

               The browser sends the form directly
               to Google Apps Script.

               Apps Script saves the enquiry and
               returns the Thank You page containing
               the real Enquiry ID.

               ------------------------------------------------- */

            enquiryForm.method =
                "POST";


            enquiryForm.action =
                GOOGLE_SCRIPT_URL;


            enquiryForm.target =
                "_top";


            /* -------------------------------------------------
               SHOW LOADING STATE
               ------------------------------------------------- */

            setLoading(
                true
            );


            /* -------------------------------------------------
               NATIVE FORM SUBMISSION
               -------------------------------------------------

               Calling the native prototype prevents
               the submit event from firing again.

               ------------------------------------------------- */

            HTMLFormElement
                .prototype
                .submit
                .call(
                    enquiryForm
                );

        }
    );


    /* =====================================================
       READY MESSAGE
       ===================================================== */

    console.log(
        "Nootech Computer Centre Enquiry Form READY - DIRECT POST MODE"
    );
}


/* =========================================================
   START APPLICATION
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeEnquiryForm
    );

}

else {

    initializeEnquiryForm();

}
