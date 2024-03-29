import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import AltButton from "../../../form/AltButton";
import UseVerify from "../../../../hooks/useVerify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;

  return formattedDate;
}

const AcountClientOngoingPromos = () => {
  const navigation = useNavigate();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/promos/ongoing-promos-client?id=${dataFetch._id}`
      );
      console.log(result.data);
      if (result.data.code === 200) {
        setData(result.data.promos);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const returnStatus = (statusPromo) => {
    if (statusPromo === "wait") {
      return "Pending";
    } else if (statusPromo === "work") {
      return "Confirmed";
    } else {
      return "Pending";
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="account-client-past-promos">
      <div className="container-form">
        <div className="account-client-past-promos-block">
          <TitleSection title="MY" span="account" />

          <p className="account-client-past-promos-second">Ongoing promos</p>

          <FormContainer
            style={{
              marginTop: "70px",
              display: data.length !== 0 ? "block" : "none",
            }}
          >
            <div className="account-client-past-promos-form">
              <ul className="account-client-past-promos-form-list">
                {data.map((item, index) => (
                  <li
                    className="account-client-past-promos-form-item"
                    key={item._id}
                  >
                    <button
                      className="account-client-past-promos-form-item-button"
                      onClick={() =>
                        navigation(`/account/client/ongoing-promos/${item._id}`)
                      }
                    >
                      <div
                        className="account-client-past-promos-form-image"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          background:
                            item.statusPromo === "wait"
                              ? "rgb(46 46 63 / 50%)"
                              : "rgba(51, 48, 228, 0.5)",
                        }}
                      >
                        <p>{returnStatus(item.statusPromo)}</p>
                        <p>{formatDate(item.createdAt)}</p>
                      </div>
                      <p className="account-client-past-promos-form-text">
                        Promo {index + 1}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>

              {data.length > 20 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "45px",
                  }}
                >
                  <AltButton text="See more" />
                </div>
              )}
            </div>
          </FormContainer>
        </div>
      </div>
    </section>
  );
};

export default AcountClientOngoingPromos;
