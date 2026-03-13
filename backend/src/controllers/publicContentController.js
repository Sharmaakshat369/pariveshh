const PublicContent = require("../models/PublicContent");

const DEFAULT_CONTENT = {
  homeTopUpdates: [
    "New guidelines for CRZ Clearance issued on 12th Oct 2024",
    "Portal maintenance scheduled for Sunday 02:00 AM IST",
    "Submit compliance reports before 31st March 2025",
  ],
  manuals: [
    {
      title: "User Manual for Project Proponents",
      description: "Complete guide for submitting proposals via PARIVESH",
      category: "General",
      fileSize: "4.2 MB",
      downloadUrl: "#",
    },
    {
      title: "Environmental Clearance Submission Guide",
      description: "Step-by-step walkthrough for EC applications",
      category: "Environment",
      fileSize: "3.1 MB",
      downloadUrl: "#",
    },
  ],
  clearanceSidebarLinks: [
    "Overview",
    "Know Your Approving Authority(KYAA)",
    "Know Your Process Flow",
    "Know Your Application Forms",
    "Agenda & MoM",
    "Notifications & Orders",
  ],
  clearances: [
    {
      category: "Environment",
      forms: [
        {
          name: "Fresh Proposal Form (Env)",
          desc: "Fresh Proposal Form for Environment clearance",
          seq: "CAF + Fresh Proposal Form (Env)",
          docUrl: "#",
          pdfUrl: "#",
        },
        {
          name: "Amendment Proposal Form",
          desc: "Amendment Proposal Form",
          seq: "CAF + Amendment Proposal Form",
          docUrl: "#",
          pdfUrl: "#",
        },
      ],
    },
    {
      category: "Forest",
      forms: [
        {
          name: "Forest Diversion Form",
          desc: "Form for forest land diversion",
          seq: "CAF + Forest Diversion",
          docUrl: "#",
          pdfUrl: "#",
        },
      ],
    },
    {
      category: "Wildlife",
      forms: [
        {
          name: "Wildlife Clearance Form",
          desc: "Form for wildlife protected areas",
          seq: "CAF + Wildlife Clearance",
          docUrl: "#",
          pdfUrl: "#",
        },
      ],
    },
    {
      category: "CRZ",
      forms: [
        {
          name: "Fresh Proposal Form (New)",
          desc: "Fresh Proposal Form of CRZ clearance",
          seq: "CAF + Fresh Proposal Form (New)",
          docUrl: "#",
          pdfUrl: "#",
        },
      ],
    },
  ],
};

const getOrCreateContent = async () => {
  let content = await PublicContent.findOne({ key: "HOME_PUBLIC_CONTENT" });

  if (!content) {
    content = await PublicContent.create({
      key: "HOME_PUBLIC_CONTENT",
      ...DEFAULT_CONTENT,
    });
  }

  return content;
};

exports.getPublicContent = async (req, res) => {
  try {
    const content = await getOrCreateContent();

    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch public content",
      error: error.message,
    });
  }
};

exports.updatePublicContent = async (req, res) => {
  try {
    const {
      homeTopUpdates,
      manuals,
      clearanceSidebarLinks,
      clearances,
    } = req.body;

    const updatePayload = {
      lastUpdatedBy: req.user._id,
    };

    if (Array.isArray(homeTopUpdates)) updatePayload.homeTopUpdates = homeTopUpdates;
    if (Array.isArray(manuals)) updatePayload.manuals = manuals;
    if (Array.isArray(clearanceSidebarLinks)) updatePayload.clearanceSidebarLinks = clearanceSidebarLinks;
    if (Array.isArray(clearances)) updatePayload.clearances = clearances;

    const content = await PublicContent.findOneAndUpdate(
      { key: "HOME_PUBLIC_CONTENT" },
      updatePayload,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Public content updated successfully",
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update public content",
      error: error.message,
    });
  }
};
