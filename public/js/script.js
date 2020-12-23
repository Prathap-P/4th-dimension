$(document).ready(()=>{
	var deleteBlog= $(".deleteBlog");
	deleteBlog.on("click", ()=>{
		fetch(`/blogs/delete/${deleteBlog.data("id")}`, {
				method: "DELETE" })
			.then(response => response.json())
			.then(() => fetch("blogs/user"));
	});

});