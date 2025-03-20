document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];
    let totalPrice = 0;

    function calculateTotal() {
        totalPrice = 0;
        cart.forEach(item => {
            let product = products.find(p => p.id == item.product_id);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        });
        document.getElementById('totalAmount').innerText = `Total: ₹${totalPrice}`;
    }

    // Fetch product details
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            calculateTotal(); // Ensure the total is updated after fetching data
        })
        .catch(error => {
            console.error("Error loading product data:", error);
        });

    document.getElementById("checkoutForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let address = document.getElementById("address").value.trim();
        let city = document.getElementById("city").value.trim();
        let district = document.getElementById("district").value.trim();
        let pincode = document.getElementById("pincode").value.trim();
        let phone = document.getElementById("phone").value.trim();

        if (!name || !address || !city || !district || !pincode || !phone) {
            alert("Please fill all the details before proceeding.");
            return;
        }

        let deliveryCharge = (pincode === "611002") ? 0 : 50;
        let finalTotal = totalPrice + deliveryCharge;

        let orderDetails = `🛒 *New Order Received*\n\n`;
        orderDetails += `👤 *Name:* ${name}\n🏠 *Address:* ${address}, ${city}, ${district}\n📍 *Pincode:* ${pincode}\n📞 *Phone:* ${phone}\n\n🛍️ *Products Ordered:*\n`;

        cart.forEach(item => {
            let product = products.find(p => p.id == item.product_id);
            if (product) {
                orderDetails += `✅ ${product.name} (x${item.quantity}) - ₹${product.price * item.quantity}\n`;
            }
        });

        orderDetails += `\n🚚 *Delivery Charge:* ₹${deliveryCharge}`;
        orderDetails += `\n💰 *Total Amount:* ₹${finalTotal}`;
        orderDetails += `\n\n📩 *Please send payment to 98789251221 and share the screenshot for confirmation.*`;

        // Sending order details via WhatsApp
        let whatsappURL = `https://api.whatsapp.com/send?phone=919789251221&text=${encodeURIComponent(orderDetails)}`;
        window.location.href = whatsappURL;
    });
});
