import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebaseConfig";
import {loadStripe} from '@stripe/stripe-js';
const Home = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState([])

  // useEffect(() => {
  //  db.collection('customers').doc(userId).collection
  //   ("subscriptions").get().then
  //   (snapshot => {
  //     snapshot.forEach(subscription => {
  //       setSubscription({
  //         role: Subscription.data().role,
  //         current_period_start: subscription.data().current_period_start,
  //         current_period_end: subscription.data().current_period_end,
  //       })
  //     })
  //   })
  // })
  const db = firebase.firestore();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);
        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on("value", (snapshot) => {
          const user = snapshot.val();
         
        });
      } else {
        setUserId("");
        setUserName("");
      }
    });
    db.collection('products').where('active','==',true).get().then(snapshot => {
        const products = {}
        snapshot.forEach(async productDoc => {
          products[productDoc.id] = productDoc.data()
          setProducts(products)
          const priceSnapshot = await productDoc.ref.collection('prices').get();
          priceSnapshot.forEach(priceDoc => {
            products[productDoc.id].prices = {
              priceId: priceDoc.id,
              priceData: priceDoc.data()
            
            }
          })
        })
    })
 
  }, [userId]);

  // const checkout = (plan) => {
  //   fetch("https://react-express-stripe-subscription.vercel.app/api/v1/create-subscription-checkout-session", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     mode: "cors",
  //     body: JSON.stringify({ plan: plan, customerId: userId }),
  //   })
  //     .then((res) => {
  //       if (res.ok) return res.json();
  //       console.log(res);
  //       return res.json().then((json) => Promise.reject(json));
  //     })
  //     .then(({ session }) => {
  //       console.log("ww"+session)
  //        window.location = session.url;
  //     })
  //     .catch((e) => {
  //       console.log(e.error);
  //     });
  // };

  const checkout = async(priceId) => {
    console.log("click")
      const  docRef = await db.collection('customers').doc(userId).collection
      ("checkout_sessions").add({
        price: priceId,
        success_url:window.location.origin,
        cancel_url: window.location.origin
      })
      docRef.onSnapshot(async(snap)=>{
        const{error, sessionId} = snap.data();
        if(error){
          alert(error.message)
        } 
        if(sessionId){
          const stripe = await loadStripe("pk_test_51O9QidC3HfduuBb8OI5QcCJU3LHyL0ehcwWKD8f2DAblpFevqnFoZoZZWMdGzBo5lufhiOoA6NFeC3t45H12K6jR001Y7PTtdm");
          stripe.redirectToCheckout({sessionId})
        }
      })
  }
  return (
    <>
      <div className="flex flex-col items-center w-full mx-auto min-h-screen diagonal-background overflow-x-hidden">
        <div className="flex justify-between items-center w-full px-6 h-20 bg-[#00000012]">
          <div className="text-4xl font-bold text-white">Figmafolio Payment Prototype</div>
          <div className="flex justify-center items-center gap-2">
            {!userId ? (
              <a
                href="/login"
                className="bg-white px-4 py-2 uppercase w-auto rounded-lg text-xl text-[#4f7cff] font-semibold"
              >
                Login
              </a>
            ) : (
              <div className="flex justify-center items-center space-x-4">
                <span className="text-white text-xl">{userName}</span>
                <button
                  onClick={() => firebase.auth().signOut()}
                  className="bg-white px-4 py-2 w-auto rounded-lg text-base uppercase font-semibold text-[#4f7cff]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 z-50 place-items-center w-9/12 mx-auto
        mt-20"
        >
          {Object.entries(products).map(([productId, productData]) => {
            return (
              <div className="plans" key={productId}> 
                <div> {productData.name}</div>
          
                <button  onClick={()=> checkout("price_1O9QlfC3HfduuBb8IEGyZK9L")}>Subscribe</button>
              </div>

            )
          })}
          {/* {data.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white px-6 py-8 rounded-xl text-[#4f7cff] w-full mx-auto grid 
              place-items-center ${
                planType === item.title.toLowerCase() &&
                "border-[16px] border-green-400"
              }`}
            >
              <div className="text-4xl text-slate-700 text-center py-4 font-bold">
                {item.title}
              </div>
              <p className="lg:text-sm text-xs text-center px-6 text-slate-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Dignissimos quaerat dolore sit eum quas non mollitia
                reprehenderit repudiandae debitis tenetur?
              </p>
              <div className="text-4xl text-center font-bold py-4">
                Php {item.price}
              </div>
              <div className="mx-auto flex justify-center items-center my-3">
                {planType === item.title.toLowerCase() ? (
                  <button className="bg-green-600 text-white rounded-md text-base uppercase w-auto py-2 px-4 font-bold">
                    Subscribed
                  </button>
                ) : (
                  <button
                    onClick={() => checkout(Number(item.price))}
                    className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2 font-bold"
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </>
  );
};
export default Home;
