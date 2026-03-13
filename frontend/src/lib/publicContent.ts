import { apiRequest } from '@/lib/api';
import type { PublicContent } from '@/types';

const CONTENT_TOKEN_KEY = 'parivesh_auth_token';

interface PublicContentResponse {
  success: boolean;
  content: Partial<PublicContent>;
}

const defaultContent: PublicContent = {
  homeTopUpdates: [
    'New guidelines for CRZ Clearance issued on 12th Oct 2024',
    'Portal maintenance scheduled for Sunday 02:00 AM IST',
    'Submit compliance reports before 31st March 2025',
  ],
  manuals: [
    {
      title: 'User Manual for Project Proponents',
      description: 'Complete guide for submitting proposals via PARIVESH',
      category: 'General',
      fileSize: '4.2 MB',
      downloadUrl: '#',
    },
    {
      title: 'Environmental Clearance Submission Guide',
      description: 'Step-by-step walkthrough for EC applications',
      category: 'Environment',
      fileSize: '3.1 MB',
      downloadUrl: '#',
    },
  ],
  clearanceSidebarLinks: [
    'Overview',
    'Know Your Approving Authority(KYAA)',
    'Know Your Process Flow',
    'Know Your Application Forms',
    'Agenda & MoM',
    'Notifications & Orders',
  ],
  clearances: [
    {
      category: 'Environment',
      forms: [
        {
          name: 'Fresh Proposal Form (Env)',
          desc: 'Fresh Proposal Form for Environment clearance',
          seq: 'CAF + Fresh Proposal Form (Env)',
          docUrl: '#',
          pdfUrl: '#',
        },
      ],
    },
    {
      category: 'Forest',
      forms: [
        {
          name: 'Forest Diversion Form',
          desc: 'Form for forest land diversion',
          seq: 'CAF + Forest Diversion',
          docUrl: '#',
          pdfUrl: '#',
        },
      ],
    },
    {
      category: 'Wildlife',
      forms: [
        {
          name: 'Wildlife Clearance Form',
          desc: 'Form for wildlife protected areas',
          seq: 'CAF + Wildlife Clearance',
          docUrl: '#',
          pdfUrl: '#',
        },
      ],
    },
    {
      category: 'CRZ',
      forms: [
        {
          name: 'Fresh Proposal Form (New)',
          desc: 'Fresh Proposal Form of CRZ clearance',
          seq: 'CAF + Fresh Proposal Form (New)',
          docUrl: '#',
          pdfUrl: '#',
        },
      ],
    },
  ],
};

const normalizeContent = (content?: Partial<PublicContent> | null): PublicContent => ({
  homeTopUpdates: Array.isArray(content?.homeTopUpdates) ? content.homeTopUpdates : defaultContent.homeTopUpdates,
  manuals: Array.isArray(content?.manuals) ? content.manuals : defaultContent.manuals,
  clearanceSidebarLinks: Array.isArray(content?.clearanceSidebarLinks) ? content.clearanceSidebarLinks : defaultContent.clearanceSidebarLinks,
  clearances: Array.isArray(content?.clearances) ? content.clearances : defaultContent.clearances,
});

export const getDefaultPublicContent = (): PublicContent => defaultContent;

export const fetchPublicContent = async (): Promise<PublicContent> => {
  const response = await apiRequest<PublicContentResponse>('/api/public-content', {
    method: 'GET',
  });

  return normalizeContent(response.content);
};

export const updatePublicContent = async (payload: PublicContent): Promise<PublicContent> => {
  const token = localStorage.getItem(CONTENT_TOKEN_KEY);

  if (!token) {
    throw new Error('Admin session missing. Please login again.');
  }

  const response = await apiRequest<PublicContentResponse>('/api/public-content', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return normalizeContent(response.content);
};
