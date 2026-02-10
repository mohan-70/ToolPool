let allTools = [];

document.addEventListener('DOMContentLoaded', () => {
    const toolsGrid = document.getElementById('tools-grid');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    // 1. Listen for available tools in real-time
    db.collection("tools").where("status", "==", "available")
    .onSnapshot((querySnapshot) => {
        allTools = [];
        querySnapshot.forEach((doc) => {
            allTools.push({ id: doc.id, ...doc.data() });
        });
        renderTools(allTools);
    }, (error) => {
        console.error("Firestore Permission Error:", error);
        if (toolsGrid) {
            toolsGrid.innerHTML = `<p style="color: red;">Access Denied. Please check your Firestore Rules.</p>`;
        }
    });

    // 2. Search and Category Filter logic
    const handleFilter = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedCategory = categoryFilter ? categoryFilter.value : "all";

        const filtered = allTools.filter(tool => {
            const name = (tool.name || "").toLowerCase();
            const desc = (tool.description || "").toLowerCase();
            const matchesSearch = name.includes(searchTerm) || desc.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        renderTools(filtered);
    };

    if(searchInput) searchInput.addEventListener('input', handleFilter);
    if(categoryFilter) categoryFilter.addEventListener('change', handleFilter);
});

// 3. UI Rendering Logic
function renderTools(toolsList) {
    const toolsGrid = document.getElementById('tools-grid');
    if (!toolsGrid) return;
    toolsGrid.innerHTML = "";

    if (toolsList.length === 0) {
        toolsGrid.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>No tools found matching your criteria.</p>";
        return;
    }

    toolsList.forEach((tool) => {
        const rating = tool.avgRating ? `⭐ ${tool.avgRating.toFixed(1)}` : "New Listing";
        toolsGrid.innerHTML += `
            <div class="tool-card" style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: white;">
                <img src="${tool.imageUrl || 'https://via.placeholder.com/250x150?text=No+Image'}" 
                     alt="${tool.name}" style="width: 100%; height: 150px; object-fit: cover;">
                <div class="card-content" style="padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <h3 style="margin: 0;">${tool.name || "Unnamed Tool"}</h3>
                        <span style="color: #ffa100; font-weight: bold; font-size: 0.8rem;">${rating}</span>
                    </div>
                    <p style="color: #666; font-size: 0.9rem; margin: 10px 0;">${tool.description || "No description available."}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <span class="price" style="font-weight: bold; color: #2e7d32;">$${tool.pricePerDay || 0}/day</span>
                        <button onclick="borrowTool('${tool.id}')" class="btn-secondary" 
                                style="background: #333; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            Borrow
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

// 4. Borrowing Request Logic
function borrowTool(toolId) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please login or create an account to borrow tools!");
        window.location.href = "login.html";
        return;
    }

    db.collection("tools").doc(toolId).get().then((doc) => {
        const tool = doc.data();
        
        // Final check to prevent 'undefined' crashes
        if (!tool.ownerId) {
            alert("Database Error: This tool does not have an owner linked to it.");
            return;
        }

        if (tool.ownerId === user.uid) {
            alert("This is your tool! Check your profile to see if anyone else wants to borrow it.");
            return;
        }

        return db.collection("requests").add({
            toolId: toolId,
            toolName: tool.name,
            ownerId: tool.ownerId,
            borrowerId: user.uid,
            borrowerEmail: user.email,
            status: "pending",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    })
    .then((ref) => {
        if (ref) alert("Request Sent! The owner has been notified.");
    })
    .catch(err => {
        console.error("Borrow Error:", err);
        alert("Error: " + err.message);
    });
}