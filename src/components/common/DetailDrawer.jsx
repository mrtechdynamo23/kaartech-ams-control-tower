/**
 * EDGE AMS Control Tower — Detail Component Adapter
 * Renders the centered DetailModal for primary record inspection (Section 23, 59).
 */
import React from 'react';
import DetailModal from './DetailModal';

export default function DetailDrawer(props) {
  return <DetailModal {...props} />;
}

export { DetailModal };
