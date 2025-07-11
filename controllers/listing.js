const Listing = require("../models/listing");



module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate :{ path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing was requested does not exists!");
        res.redirect("/listings");
        return; // Prevent further execution
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing})
};

module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "Listing was Created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested  for does not exist!");
        res.redirect("/listings"); // Fixed path
        return;
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listings");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let{id}=req.params;
    let deltedListing= await Listing.findByIdAndDelete(id);
    console.log(deltedListing);
    req.flash("error", "Listing was deleted!");
    res.redirect("/listings");
};