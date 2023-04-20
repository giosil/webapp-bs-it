<%@ page import="org.dew.webapp.util.*" contentType="text/html; charset=UTF-8" %>
<%
	String debug = request.getParameter("debug");
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Cookie policy</title>
		<%@ include file="_imp_page_header.jsp" %>
	</head>
	<body class="page-template page">
		<div id="wrapper">
			<%@ include file="_imp_body_header.jsp" %>
			
			<div id="container">
				<section id="content" role="main" class="container">

					<div class="container">
						<article class="page type-page status-publish hentry">
							<header class="header">
								<h1 class="entry-title">Cookie policy</h1>
							</header>
							<section class="entry-content">
								<div class="textwidget">
									<h3>Elenco dei cookie</h3>
									<p>&nbsp;</p>
									<p>
										Un cookie &egrave; una piccola porzione di dati (file di testo) che un sito Web, se visitato da un utente, chiede al browser di memorizzarlo sul dispositivo per ricordare le sue informazioni, quali la lingua preferita o i dati di accesso. 
										Questi cookie sono da noi impostati e denominati cookie di prima parte. Utilizziamo inoltre cookie di terza parte - ovvero i cookie di un dominio diverso da quello del sito Web che si sta visitando - per i nostri tentativi pubblicitari e di marketing. 
										In particolare, utilizziamo i cookie e altre tecnologie di tracciamento per i seguenti scopi:
									</p>
									<p>&nbsp;</p>
									<p><strong>Cookie strettamente necessari</strong></p>
									<p>
										Questi cookie sono necessari per il funzionamento del sito e non possono essere disattivati ​​nei nostri sistemi. 
										Di solito vengono impostati solo in risposta alle azioni da te effettuate che costituiscono una richiesta di servizi, come l'impostazione delle preferenze di privacy, l'accesso o la compilazione di moduli. 
										&Egrave; possibile impostare il browser per bloccare o avere avvisi riguardo questi cookie, ma di conseguenza alcune parti del sito non funzioneranno. 
										Questi cookie non archiviano informazioni personali.
									</p>
									<p>&nbsp;</p>
									<div id="ot-sdk-cookie-policy"></div>
									<p>&nbsp;</p>
									<p><strong>Aggiornamenti</strong></p>
									<p>La presente cookie policy &egrave; aggiornata alla data del 2 febbraio 2023.</p>
								</div>
							</section>
						</article>
					</div>

				</section>
			</div>
			
			<%@ include file="_imp_body_footer.jsp" %>
		</div>
		<%@ include file="_imp_page_footer.jsp" %>
	</body>
</html>