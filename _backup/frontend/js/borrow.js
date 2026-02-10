function borrowTool(toolId) {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to borrow tools!");
        window.location.href = "login.html";
        return;
    }

    // 1. Create a request in a new 'requests' collection
    db.collection("requests").add({
        toolId: toolId,
        borrowerId: user.uid,
        borrowerEmail: user.email,
        status: "pending",
        requestDate: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        // 2. Optional: Mark the tool as 'pending' so others don't grab it
        return db.collection("tools").doc(toolId).update({
            status: "pending"
        });
    })
    .then(() => {
        alert("Request sent to the owner!");
    })
    .catch(err => alert("Error: " + err.message));
}