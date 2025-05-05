"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomePage from '../src/components/Home/HomePage';

export default function Home() {
  // Simply render the HomePage component directly
  return <HomePage />;
}
