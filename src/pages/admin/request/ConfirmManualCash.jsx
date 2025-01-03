import React, { useState, useEffect } from "react";
import { Divider, Button, Input, Label, Form, Select, Segment } from "semantic-ui-react";

import Carts from "../../../components/form/AdminCarts";
import FormikControl from "../../../components/form/FormikControl";
import { Formik } from "formik";
import * as Yup from "yup";
import CopyBtn from "../../../utils/copyInputBtn";
import CashMode from "./cashMode";
import { adminGetService, adminPostService, adminPutService } from "../../../services/admin";
import { doCurrency } from "../../../const";

const onSubmit = async (values, submitMethods, prop) => {
    submitMethods.setSubmitting(true);

    var newValues = {
        id: values.id,
        amount: values.amount * -1,
        detail: "IR" + values.toobj.shebaNumber,
    };
   // return newValues;
    const res = await adminPostService(newValues, "visaGiftCode/manualCashoutEdit", "");
    if (res.status == 200) {
        submitMethods.resetForm();
        prop.setFirstDone(false);
        prop.setFirstStatus("reload");
    }

    submitMethods.setSubmitting(false);
};
const updateCartInfo = (cartOptions, id, formik) => {
    var selectedCart = cartOptions.filter((d) => d.cardNumber == id)[0];
    formik.setFieldValue("frombank", id);

    formik.setFieldValue("fromobj", selectedCart);
    if (selectedCart?.id) {
        formik.setFieldValue("bankId", selectedCart?.id);
    }
};
const updateCartInfoTo = (cartOptions, id, formik) => {
    var selectedCart = cartOptions.filter((d) => d.cardNumber == id)[0];
    formik.setFieldValue("tobank", id);

    formik.setFieldValue("toobj", selectedCart);
    if (selectedCart?.id) {
        formik.setFieldValue("userBankId", selectedCart?.id);
    }
};

const depositArea = (prop) => {
    console.log(prop);
    const validationSchema = Yup.object({
        amount: Yup.number()
            .required("لطفا این فیلد را وارد کنید.")

            .integer(),
        userBankId: Yup.string().required("لطفا این فیلد را وارد کنید."),

        mode: Yup.string().required("لطفا این فیلد را وارد کنید.")
        .min(10, "لطفا این فیلد را درست وارد کنید.")
    
    });
    const carOptions = [
        {
            key: "1",
            value: "لطفا اطلاعات بانکی خود را تصحیح نمایید.",
            text: "لطفا اطلاعات بانکی خود را تصحیح نمایید.",
        },
    ];
    const [user, setUser] = useState(false);
    const handleGetReports = async () => {
        try {
            const res = await adminGetService("getUsersByAdmin?name=username&page=1&number=100&contain=false&value=" + prop.item.username);
            if (res.status === 200) {
                if (res.data.users.length > 0) {
                    setUser(res.data.users.filter((item) => item.username == prop.item.username)[0]);
                }
            }
        } catch (error) {}
    };

    useEffect(() => {
        handleGetReports();
    }, []);
    if (!user) {
        return <>loadings</>;
    } else {
        return (
            <Formik
                initialValues={{
                    action: prop.status,
                    id: prop.item.id,
                    amount: prop.item.pendingAmount,
                    status: prop.item.status,
                    geteway: prop.gateway.replace(/ /g, ""),
                    bankId: "",
                    userBankId: "",
                    fromobj: "",
                    toobj: "",
                    frombank: "",
                    tobank: "",
                    ticket: "",
                    mode: "IR",
                }}
                onSubmit={(values, submitMethods) => onSubmit(values, submitMethods, prop)}
                validationSchema={validationSchema}
            >
                {(formik) => {
                    const handleChange = (e, { name, value }) => {
                        formik.setFieldValue("ticket", value);
                        // $('[name="message"]:visible').val(defval);
                    };
                    return (
                        <Form>
                            <div className="onarea online1">
                                {prop.status == "Done" ? (
                                    <>
                                        <Carts formik={formik} name="tobank" label="واریز به" labelcolor={prop.labelcolor} size={prop.size} namemix updateCartInfo={updateCartInfoTo} gateway={prop.gateway} loginToken={user} carts={""} />

                                        <FormikControl formik={formik} control="amount" name="amount" labelcolor={prop.labelcolor} size={prop.size} readOnly />
                                        <FormikControl formik={formik} control="input"  label="واریز از" name="mode" labelcolor={prop.labelcolor} size={prop.size} />

                                        <Divider />
                                        <Button
                                            content={"انجام شد"}
                                            fluid
                                            style={{ marginTop: 10 }}
                                            className="farsi"
                                            color="teal"
                                            type="button"
                                            onClick={() => {
                                                onSubmit(formik.values, formik, prop);
                                            }}
                                            disabled={formik.isSubmitting || formik.values.amount > prop.item.pendingAmount || formik.values.userBankId == "" ? true : false}
                                            loading={formik.isSubmitting}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <FormikControl formik={formik} control="amount" name="amount" labelcolor={prop.labelcolor} size={prop.size} />
                                        <br /> <br />
                                        <Button.Group fluid widths={3}>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    formik.setFieldValue("mode", "Canceled");
                                                }}
                                                positive={formik.values.mode === "Canceled"}
                                            >
                                                Canceled
                                            </Button>
                                            <Button.Or text="or" />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    formik.setFieldValue("mode", "Refund");
                                                }}
                                                positive={formik.values.mode === "Refund"}
                                            >
                                                Canceled and Refund
                                            </Button>
                                        </Button.Group>
                                        {/*  <Divider />
                      <Select
                        placeholder="علت"
                        className="farsi"
                        fluid
                        options={carOptions}
                        onChange={handleChange}
                      /> */}
                                        <Divider />
                                        <Button
                                            content={"Cancele This Cashout"}
                                            fluid
                                            style={{ marginTop: 10 }}
                                            className="farsi"
                                            color="red"
                                            type="button"
                                            onClick={() => {
                                                onSubmit(formik.values, formik, prop);
                                            }}
                                            disabled={formik.isSubmitting ? true : false}
                                            loading={formik.isSubmitting}
                                        />
                                    </>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
};

export default depositArea;
