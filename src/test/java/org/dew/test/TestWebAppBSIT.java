package org.dew.test;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public 
class TestWebAppBSIT extends TestCase 
{
	public TestWebAppBSIT(String testName) {
		super(testName);
	}

	public static Test suite() {
		return new TestSuite(TestWebAppBSIT.class);
	}

	public void testApp() throws Exception {
	}
}
