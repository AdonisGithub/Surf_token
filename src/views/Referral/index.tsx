import { Grid, Zoom } from "@material-ui/core";
import GetReferralLinkButton from "./getReferralLink-button";
import "./referral.scss";

function Referral() {
    return (
        <div className="referral-view">
            <Zoom  in={true}>
                <div className="referral-card">
                    <Grid className="referral-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <div className="referral-card-header">    
                                        <p className="referral-card-header-title">Referral</p>
                                        <p className="referral-card-header-subtitle">Invite your friends to LP Staking.</p>
                                        <p className="referral-card-header-subtitle">Earn rewards 10% SURF-BNB LP Staking Pools rewards of your referrals.</p>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>                
                            <div className="referral-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-apy">
                                            <p className="referral-card-metrics-title">Total Referrals</p>
                                            <p className="referral-card-metrics-value">5</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-tvl">
                                            <p className="referral-card-metrics-title">Total Referral Rewards</p>
                                            <p className="referral-card-metrics-value">80.6 SURF </p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item>                
                            <div className="referral-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-apy">
                                            <p className="referral-card-metrics-title">Your Referrals</p>
                                            <p className="referral-card-metrics-value">2</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-tvl">
                                            <p className="referral-card-metrics-title">Your Referral Rewards</p>
                                            <p className="referral-card-metrics-value">20 SURF</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item>
                            <GetReferralLinkButton/>
                        </Grid>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Referral;
