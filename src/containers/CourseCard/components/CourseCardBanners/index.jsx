import React from 'react';
import PropTypes from 'prop-types';

import { hooks as appHooks } from 'data/redux';

import CourseBanner from './CourseBanner';
import CertificateBanner from './CertificateBanner';
import CreditBanner from './CreditBanner';
import EntitlementBanner from './EntitlementBanner';

export const CourseCardBanners = ({ cardId }) => {
  const { isEnrolled } = appHooks.useCardEnrollmentData(cardId);
  return (
    <div className="course-card-banners" data-testid="CourseCardBanners">
      <CourseBanner cardId={cardId} />
      <EntitlementBanner cardId={cardId} />
      {isEnrolled && <CertificateBanner cardId={cardId} />}
      {isEnrolled && <CreditBanner cardId={cardId} />}
    </div>
  );
};
CourseCardBanners.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardBanners;
