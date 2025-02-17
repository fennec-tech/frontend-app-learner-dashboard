/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Hyperlink } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { hooks as appHooks } from 'data/redux';
import { useFormatDate } from 'utils/hooks';
import Banner from 'components/Banner';
import messages from './messages';

export const CourseBanner = ({ cardId }) => {
  const {
    isVerified,
    isAuditAccessExpired,
    canUpgrade,
    coursewareAccess = {},
  } = appHooks.useCardEnrollmentData(cardId);
  const courseRun = appHooks.useCardCourseRunData(cardId);
  const { formatMessage } = useIntl();
  const formatDate = useFormatDate();

  const { hasUnmetPrerequisites, isStaff, isTooEarly } = coursewareAccess;

  if (isVerified) { return null; }

  return (
    <>
      {isAuditAccessExpired
        && (canUpgrade ? (
          <Banner>
            {formatMessage(messages.auditAccessExpired)}
            {'  '}
            {formatMessage(messages.upgradeToAccess)}
          </Banner>
        ) : (
          <Banner>
            {formatMessage(messages.auditAccessExpired)}
            {'  '}
            {
              <Hyperlink destination="">
                {formatMessage(messages.findAnotherCourse)}
              </Hyperlink>
            }
          </Banner>
        ))}

      {courseRun.isActive && !canUpgrade && (
        <Banner>
          {formatMessage(messages.upgradeDeadlinePassed)}
          {'  '}
          <Hyperlink destination={courseRun.marketingUrl || ''}>
            {formatMessage(messages.exploreCourseDetails)}
          </Hyperlink>
        </Banner>
      )}

      {(!isStaff && isTooEarly && courseRun.startDate) && (
        <Banner>
          {formatMessage(messages.courseHasNotStarted, {
            startDate: formatDate(courseRun.startDate),
          })}
        </Banner>
      )}
      {(!isStaff && hasUnmetPrerequisites) && (
        <Banner>{formatMessage(messages.prerequisitesNotMet)}</Banner>
      )}
    </>
  );
};
CourseBanner.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseBanner;
