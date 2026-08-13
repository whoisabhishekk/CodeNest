// ===== XSS SANITIZER =====
// Yeh function user input me se khatarnak HTML/script tags hata deta hai
// Jaise agar koi type kare: <script>alert('hacked')</script>
// Toh yeh usse safe bana dega: &lt;script&gt;alert('hacked')&lt;/script&gt;

const sanitize = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

export default sanitize;
