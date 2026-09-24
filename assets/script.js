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
           ------------------------------------------------- */

        const batchType =
            document.querySelector(
                'input[name="batchType"]:checked'
            );


        if (!batchType) {

            const error =
                document.getElementById(
                    "batchTypeError"
                );


            if (error) {

                error.textContent =
                    "Please select a Batch type.";
            }


            valid = false;
        }


        return valid;
    }


    /* =====================================================
       ADD / UPDATE HIDDEN FIELD
       ===================================================== */

    function addHiddenField(
        name,
        value
    ) {

        let input =
            enquiryForm.querySelector(
                'input[type="hidden"][name="' +
                name +
                '"]'
            );


        if (!input) {

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
             * Prevent the default submission temporarily
             * so validation can run first.
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
               DIRECT FORM SUBMISSION
               -------------------------------------------------

               This is the important part.

               The browser sends the form directly to
               Google Apps Script.

               There is:

               NO fetch()
               NO CORS
               NO iframe
               NO JSONP
               NO postMessage()
               NO polling

               Apps Script will save the enquiry and
               return the Thank You page containing
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

               We intentionally call the native HTML
               form submission method.

               This prevents the submit event from
               firing again.
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
        "Nootech COmputer Centre Enquiry Form READY - DIRECT POST MODE"
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
