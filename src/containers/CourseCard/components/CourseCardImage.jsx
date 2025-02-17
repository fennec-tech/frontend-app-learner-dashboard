import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Badge } from '@edx/paragon';

import track from 'tracking';
import { hooks as appHooks } from 'data/redux';

import verifiedRibbon from 'assets/verified-ribbon.png';

import messages from '../messages';

const { courseImageClicked } = track.course;

export const CourseCardImage = ({ cardId, orientation }) => {
  const { formatMessage } = useIntl();
  const { bannerImgSrc } = appHooks.useCardCourseData(cardId);
  const { homeUrl } = appHooks.useCardCourseRunData(cardId);
  const { isVerified } = appHooks.useCardEnrollmentData(cardId);
  const { isEntitlement } = appHooks.useCardEntitlementData(cardId);
  const handleImageClicked = appHooks.useTrackCourseEvent(courseImageClicked, cardId, homeUrl);
  const wrapperClassName = `pgn__card-wrapper-image-cap overflow-visible ${orientation}`;
  const image = (
    <>
      <img
        className="pgn__card-image-cap"
        src={bannerImgSrc}
        alt={formatMessage(messages.bannerAlt)}
      />
      {
        isVerified && (
          <span
            className="course-card-verify-ribbon-container"
            title={formatMessage(messages.verifiedHoverDescription)}
          >
            <Badge as="div" variant="success" className="w-100">
              {formatMessage(messages.verifiedBanner)}
            </Badge>
            <img src={verifiedRibbon} alt={formatMessage(messages.verifiedBannerRibbonAlt)} />
          </span>
        )
      }
    </>
  );
  return isEntitlement
    ? (<div className={wrapperClassName}>{image}</div>)
    : (
      <a
        className={wrapperClassName}
        href={homeUrl}
        onClick={handleImageClicked}
      >
        {image}
      </a>
    );
};
CourseCardImage.propTypes = {
  cardId: PropTypes.string.isRequired,
  orientation: PropTypes.string.isRequired,
};

CourseCardImage.defaultProps = {};

export default CourseCardImage;
